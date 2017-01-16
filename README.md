# ng-pendo v1.2.0

## Installation

```shell
$ npm i --save ng-pendo
```

## Usage

Import pendolytics module:
```javascript
import ngPendo from 'ng-pendo';
```
or
```javascript
var ngPendo = require('ng-pendo');
```

Provide your api key:

```javascript
window.pendo_options = {
    apiKey: 'replace this with your api key',
    usePendoAgentAPI: true
};
```

Include `pendolytics` in your AngularJS modules:

```javascript
angular.module('your-app', [...,'pendolytics',...]);
```
or
```javascript
angular.module('your-app', [...,ngPendo,...]);
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
