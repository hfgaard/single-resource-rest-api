'use strict';

var express = require('express');
var mongoose = require('mongoose');
var app = express();

var routes = express.Router();
mongoose.connect(process.env.MONGOLAB_URL || 'mongodb://localhost/user_dev');

require('./routes/user-routes')(routes);
app.use('/api', routes);

app.listen((process.env.PORT || 3000), function() {
  console.log('Server has started on port ' + (process.env.PORT || 3000));
});
