const path = require('path')
const srcPath = path.join(__dirname,'/../src')
const dfltPort = 8000


function getDefaultModules(){
  return {
    loaders:[
      {
        test: /\.js$/,
        exclude:/node_modules/,
        loader:'babel-loader',
        query:{
          presets:['react','es2015','stage-0'],
          plugins:[]
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader'
      },
      {
        test: /\.sass/,
        loader: 'style-loader!css-loader!sass-loader?outputStyle=expanded&indentedSyntax'
      },
      {
        test: /\.scss/,
        loader: 'style-loader!css-loader!sass-loader?outputStyle=expanded!postcss-loader'
      },
      {
        test: /\.styl/,
        loader: 'style-loader!css-loader!stylus-loader'
      },
      {
        test: /\.(png|jpg|gif|woff|woff2)$/,
        loader: 'url-loader?limit=8192'
      },
      { test: /\.(eot|svg|ttf)([\?]?.*)$/, loader: "file-loader" },
    ]
  }
}

module.exports= {
  srcPath : srcPath,
  publicPath: '/assets/',
  port: dfltPort,
  getDefaultModules: getDefaultModules
}