# babel-plugin-export-webpack-module-id

<p>
  <a href="https://www.npmjs.com/package/babel-plugin-export-webpack-module-id">
    <img src="https://img.shields.io/teamcity/codebetter/bt428.svg" alt="Build Status" />
  </a>

  <a href="https://www.npmjs.com/package/babel-plugin-export-webpack-module-id">
    <img src="https://img.shields.io/npm/l/express.svg" alt="License" />
  </a>

  <a href="https://www.npmjs.com/package/babel-plugin-export-webpack-module-id">
    <img src="https://img.shields.io/badge/dependencies-none-brightgreen.svg" alt="No Dependencies" />
  </a>
</p>

Adding `webpackModuleId` to default export and named export, it's useful for HMR support

## Installation

### yarn
```
yarn add babel-plugin-export-webpack-module-id
```

### npm 
```
npm install babel-plugin-export-webpack-module-id
```

*.babelrc:*
```js
{
  "plugins": ["export-webpack-module-id"]
}
```


## What it does

For each module, export `webpackModuleId`

Taking from the [test snapshots](./__tests__/__snapshots__/index.js.snap), it does this:

```js
export default function() {
  var x = 5;
  console.log('xxxx');
}

      ↓ ↓ ↓ ↓ ↓ ↓

var _ref = function () {
  var x = 5;
  console.log('xxxx');
};

_ref.webpackModuleId = module.id;
export default _ref;
export const webpackModuleId = module.id;
```

> For more usages, please find the detail in `./__tests__/index.js`


## Options

`webpackModuleId`：The property name of the module id. `string`, default: `'webpackModuleId'`

`include`： which files to add module id. `string | string[]`, default: `undefined`
