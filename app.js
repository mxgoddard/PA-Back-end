const app = require('express')();
const bodyParser = require('body-parser');
const router = require('./router/routes');

app.use(bodyParser.json());
app.use('/', router);

module.exports = app;
