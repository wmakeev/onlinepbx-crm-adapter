/**
 * server.js
 * Date: 16.08.14
 * Vitaliy V. Makeev (w.makeev@gmail.com)
 */

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var serveStatic = require('serve-static');
var handler = require('./handler');

var server = express();

server.use(serveStatic(path.resolve(__dirname, '../public')));
server.use(favicon(path.resolve(__dirname, '../public/favicon.ico')));
server.use(bodyParser.urlencoded({ extended: true }));
// server.use(bodyParser.json());

server.post('/addon', handler);

server.use(function (err, req, res, next) {
  console.error(err.message);
  res.status(200).send({
    status: 0,
    comment: err.message
  });
});

server.listen(process.env.PORT || 5000);