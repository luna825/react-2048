let path = require('path')
let baseConfig = require('./base.js')
let defaultSettings = require('./defaults')
let webpack = require('webpack');

let config = Object.assign({},baseConfig,{
  entry: [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8000',
    './src/index'
  ],
  cache:true,
  devtool: 'eval-source-map',
  module:defaultSettings.getDefaultModules(),
  plugins:[
    new webpack.HotModuleReplacementPlugin()
  ]
})

// config.module.loaders[0].query.plugins.push([
//   'react-transform',{
//     transforms:[{
//       transform:'react-transform-hmr',
//       imports: ['react'],
//       locals:['module']
//   }]
// }])

module.exports = config;