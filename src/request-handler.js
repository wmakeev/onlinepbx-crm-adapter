if (!process.env.CRM_ADAPTER) {
    throw new Error('"CRM_ADAPTER" env not set');
}
var crmAdapter = require(process.env.CRM_ADAPTER);

module.exports = function handler (req, res, next) {
  // console.log(req);
  
  var body = req.body;
  var action = crmAdapter[body.action];
  
  if (!action) { 
    return next(new Error('Обработчик операции [' + body.action + '] не найден'));
  }
  
  action(body.data, function (err, data) {
    if (err) { return next(err) } 
    
    var responseData = {
      status: "1",
      comment: 'Запрос успешно выполнен',
      data: data
    };
    
    console.log(responseData.comment, responseData.data);
    
    res.send(responseData);
    
    next();
  });
};