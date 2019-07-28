var express = require('express');
var app = express();
var bodyParser = require('body-parser');
require('./discord/index');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
  res.send('Welcome to my word! I am Utadorei :)');
});

app.listen(process.env.PORT || 3000, function() {
  console.log('Utadorei app listening on port 3000!');
});
