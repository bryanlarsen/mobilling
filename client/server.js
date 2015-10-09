/* eslint-disable no-console, func-names, no-var */
var bodyParser = require('body-parser');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.client.hot.config');

var server = new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  stats: {
    colors: true,
    hash: false,
    version: false,
    chunks: false,
    children: false,
  },
});

server.app.use(bodyParser.json(null));
server.app.use(bodyParser.urlencoded({extended: true}));

server.app.use('/', function(req, res) {
  res.send("<!DOCTYPE html> <html> <head> <title>BillOHIP</title> </head> <body> <h1>Hello!</h1> </body> </html>");
});

server.listen(3000, '0.0.0.0', function(err) {
  if (err) console.log(err);
  console.log('Listening at localhost:4000...');
});
