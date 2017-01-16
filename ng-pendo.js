/*
 *       pendo.io Angular Module
 *
 *       (c) 2017 pendo.io
 */

(function (root, factory) {
    "use strict";

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['angular'], factory);
    } else if (typeof module !== 'undefined' && typeof module.exports === 'object') {
        // CommonJS support (for us webpack/browserify/ComponentJS folks)
        module.exports = factory(require('angular'));
    } else {
        return factory(root.angular);
    }
}(this, function(angular) {
    "use strict";

    var MODULE_NAME = 'pendolytics';

    var ap = {};
    ap.waitForPendo = function(delay, registerFn) {
        var waitFn = function() { ap.waitForPendo( delay, registerFn); };

        if (ap.disabled) {
            ap.afterReenable = waitFn;
            return;
        }

        if(window.pendo && window.pendo.initialize) {
            registerFn(pendo);
        } else {
            setTimeout(waitFn, delay);
        }
    };

    angular.module(MODULE_NAME, [])
        .provider('$pendolytics', function() {

            var eventCache = [];
            var service = {};
            var initializeOptions;

            var serviceImpl = {
                pageLoad: function() {
                    eventCache.push( {method: 'pageLoad', args: [] });
                },
                identify: function( newName, accountId, props ) {
                    var saveMe = { method: 'identify', args: [ newName, accountId, props ] };
                    eventCache.push(saveMe);
                },
                updateOptions: function( obj ) {
                    eventCache.push({ method: 'updateOptions', args: [obj]});
                },

                /*
                 * This will allow for initalizing the Agent asynchronously
                 * with an API key that is set after the agent has been set.
                 */
                initialize: function(options) {
                    eventCache.unshift({
                        method: 'initialize',
                        args: [options]
                    });
                }
            };

            service.pageLoad = function() {
                serviceImpl.pageLoad();
            };

            service.load = function() {
                serviceImpl = pendo;

                // Flush the cache
                angular.forEach(eventCache, function(item) {
                    pendo[item.method].apply(pendo, item.args);
                });

            };

            service.identify = function(newName, accountId, props){
                serviceImpl.identify(newName, accountId, props);
            };

            service.updateOptions = function(json_obj) {
                serviceImpl.updateOptions(json_obj);
            };

            service.initialize = function(options){
                initializeOptions = options;
                serviceImpl.initialize(options);
            };

            service.enable = function(){
                if (ap.disabled) {
                    ap.disabled = false;
                    ap.afterReenable();
                }
            };

            service.disable = function(){
                ap.disabled = true;
            };

            service.bootstrap = function() {
                if (!service.bootstrapped) {
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.async = true;
                    script.src = agentLocation();
                    var firstScript = document.getElementsByTagName('script')[0];
                    firstScript.parentNode.insertBefore(script, firstScript);
                    service.bootstrapped = true;
                }
            };

            return {
                $get: function(){ return service; },
                doNotAutoStart: function() {
                    service.doNotAutoStart = true;
                }
            };

            function agentLocation () {
                var key = apiKey();
                var protocol = (document.location.protocol === 'http:' ? 'http://' : 'https://');
                return protocol + 'cdn.pendo.io/' + (key ? 'agent/static/' + key + '/pendo.js' : 'js/pa.min.js');
            }

            function apiKey () {
                if (window.pendo_options && window.pendo_options.apiKey) {
                    return window.pendo_options.apiKey;
                }
                if (initializeOptions && initializeOptions.apiKey) {
                    return initializeOptions.apiKey;
                }
            }
        }).run(['$rootScope', '$pendolytics', function($rootScope, $pendolytics) {
        // check if the scripts are loaded first, otherwise fall back to auto starting
        if (!window.pendo &&
            !(window.analytics && window.analytics.Integrations && window.analytics.Integrations["Segment.io"]) &&
            !$pendolytics.doNotAutoStart) {

            $pendolytics.bootstrap();
        }

        ap.waitForPendo( 500, function( p ) {
            $pendolytics.load();
            $rootScope.$on('$locationChangeSuccess', function() {
                $pendolytics.pageLoad();
            });
        });
    }]);

    return MODULE_NAME;
}));
