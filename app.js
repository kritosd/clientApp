const express = require('express');
const app = express();

const routes = require('./routes/index');
const employee = require('./routes/employee');

var bodyParser = require('body-parser');
require('dotenv').config()

app.use(bodyParser.urlencoded({ extended: false }));
// view engine setup
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use('/', routes);
app.use('/employee', employee);



module.exports = app;