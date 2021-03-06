'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const express = require('express')

const data = require('../data.json')
const seller = data.seller
const goods = data.goods
const ratings = data.ratings

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

//获取本地IP地址
// let os = require('os');
// let IPv4,hostName;
// hostName=os.hostname();
// console.log('----------local host: '+hostName);
// console.log('----------local networkInterfaces: '+JSON.stringify(os.networkInterfaces()));
//
// for(let i=0;i<os.networkInterfaces().eth0.length;i++){
//   if(os.networkInterfaces().eth0[i].family=='IPv4'){
//     IPv4=os.networkInterfaces().eth0[i].address;
//   }
// }
// console.log('----------local IP: '+IPv4);


const appMock = express()

//创建router
const apiRouter = express.Router();
appMock.use('/api', apiRouter)


// appMock.listen((PORT || config.dev.port) + 1);

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({sourceMap: config.dev.cssSourceMap, usePostCSS: true})
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    before(appMock) {
      appMock.get('/api/seller', function (req, res) {
        res.json({
          errNo: 0,
          data: seller
        })
      })

      appMock.get('/api/goods', function (req, res) {
        res.json({
          errNo: 0,
          data: goods
        })
      })

      appMock.get('/api/ratings', function (req, res) {
        res.json({
          errNo: 0,
          data: ratings
        })
      })

// respond with "hello world" when a GET request is made to the homepage
    },
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        {from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html')},
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? {warnings: false, errors: true}
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://localhost:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
