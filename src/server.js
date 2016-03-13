/**
 * server.js
 * Date: 16.08.14
 * Vitaliy V. Makeev (w.makeev@gmail.com)
 */

var express = require('express');
var bodyParser = require('body-parser');
var handler = require('./request-handler');

var server = express();

server.use(bodyParser.json());

server.post('/onlinepbx', handler);

server.use(function (err, req, res, next) {
  console.error(err.message);
  res.status(200).send({
    status: 0,
    comment: err.message
  });
});

server.listen(8080);