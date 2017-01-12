# ng-pendo v1.0.4 

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
angular.module('your-app', [...,'pendolytics',...]);
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
