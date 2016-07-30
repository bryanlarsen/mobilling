var webpack = require('webpack');

module.exports = function (config) {
  config.set({
    browsers: [ 'PhantomJS' ], //run in Chrome
    //browsers: [ 'Chrome' ], //run in Chrome
    singleRun: true, //just run once by default
    frameworks: [ 'mocha', 'chai' ], //use the mocha test framework
    files: [
      'test/tests.mocha.webpack.js' //just load this file
    ],
    preprocessors: {
      'test/tests.mocha.webpack.js': [ 'webpack', 'sourcemap' ] //preprocess with webpack and our sourcemap loader
    },
    reporters: [ 'dots' ], //report results in this format
    webpack: { //kind of a copy of your webpack config
      devtool: 'inline-source-map', //just do inline source maps instead of the default
      module: {
        loaders: [
          { test: /\.js$/, loader: 'babel-loader', query: {presets: ['es2015', 'react', 'stage-0']} },
          { test: /\.json$/, loader: 'json-loader' }
        ]
      }
    },
    webpackServer: {
      noInfo: false
    }
  });
}
