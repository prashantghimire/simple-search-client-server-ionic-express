var express = require("express");
var bodyparser = require('body-parser');
var database = require('./database');
var routes = require('./routes');

var app =express();
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
database.init();
routes.configure(app);

var server = app.listen(8000, function() {
  console.log('Server listening on port ' + server.address().port);
});