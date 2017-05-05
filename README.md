# ng-pendo v1.1.0

Please note that the most recent installation snippet (found in your [install settings](https://app.pendo.io/admin/settings)) makes this integration unnecessary, but it is fine to continue using it.

### Pendo.io AngularJS module

## Installation

```shell
$ npm i --save ng-pendo
```

## Use

Provide your api key:

```javascript
window.pendo_options = {
    apiKey: 'replace this with your api key',
    usePendoAgentAPI: true
};
```

Include `$pendolytics` in your AngularJS modules:

```javascript
angular.module('your-app', [...,'$pendolytics',...]);
```

When you have access to the visitor information use it to identify the visitor:

```javascript
getVisitorInformationFromSomewhere().then(function (visitor) {
    $pendolytics.identify({
        visitor: {
            id: visitor.id,
            role: visitor.role,
            email: visitor.email
        },
        account: {
            id: visitor.accountId
        }
    });
});
```

Note that your api key needs to be set before your Angular application is bootstrapped, otherwise `$pendolytics` will not find the key, and will use an older version of the Pendo Agent. If you prefer to set your api key _after_ Angular bootstraps, you can delay `$pendolytics` from automatically starting with a config block, for example:

```javascript
angular.module('your-app').config(function ($pendolyticsProvider) {
    $pendolyticsProvider.doNotAutoStart();
});
```

Then you can manually start `$pendolytics` when you are ready:

```javascript
angular.module('your-app').run(function ($pendolytics) {
    // Set your API key and identify the visitor
    $pendolytics.initialize({
        apiKey: 'your key',
        visitor: {
            id: 'visitor id'
        },
        account: {
            id: 'account id'
        }
    });
    // Load the Pendo agent and start collecting data and displaying guides
    $pendolytics.bootstrap();
});
```
