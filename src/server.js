/**
 * server.js
 * Date: 16.08.14
 * Vitaliy V. Makeev (w.makeev@gmail.com)
 */

var restify    = require('restify'),
    crmAdapter = require('onlinepbx-moysklad');

function handler (req, res, next) {
  var body = req.body;

  crmAdapter[body.action](body.data, function (err, data) {
    res.charSet('utf-8');

    if (err) {
      res.send({
        status: "0",
        comment: err.message
      });

    } else {
      res.send({
        status: "1",
        comment: 'Запрос успешно выполнен',
        data: data
      });
    }

    next();
  });
}

var server = restify.createServer();

server.use(restify.bodyParser());
server.use(restify.queryParser());

server.post('/v1/onlinepbx', handler);

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});