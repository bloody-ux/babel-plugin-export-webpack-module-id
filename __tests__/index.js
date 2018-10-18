/* eslint-disable no-template-curly-in-string */

const pluginTester = require('babel-plugin-tester')
const createBabylonOptions = require('babylon-options')
const plugin = require('../index')

const babelOptions = {
  filename: 'currentFile.js',
  parserOpts: createBabylonOptions({
    stage: 2
  })
}

pluginTester({
  plugin,
  babelOptions,
  snapshot: true,
  tests: {
    'export default function': `
      export default function() {
        var x = 5;
        console.log('xxxx');
      }
    `,
    'export default class': `
     export default class XXX{
        a() {

        }
      }
    `,
    'export default variable expression': `
      export default k = 12;
    `,
    'export default class variable': `
      class X {}
      export default X;
    `,
    'export default function variable': `
      function X() {}
      export default X;
    `,
    'export call expression': `
      export default connect()(function(){})
    `,
    'export with babel options': {
      code: `
      export default connect()(function(){})
      `,
      pluginOptions: {
        webpackModuleId: 'moduleId'
      }
    }
  }
})

