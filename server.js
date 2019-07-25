var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/webhook', function (req, res) {
  if(!req.body) {return res.sendStatus(400)};
  params = req.body.queryResult.parameters;
  res.json(handleParams(params));
})

function handleParams(params) {
  if(isExist(params['eSingerName']) &&
    isExist(params['eActionMusic']) &&
    isExist(params['eGenitive'])) {
      return handleIMusicGenitive(params['eSingerName']);
  }
}

function handleIMusicGenitive(eSingerName) {
  return responseObj = {
    'fulfillmentText': 'Nhac sep nhu kec'
  }
}

function isExist(param) {
  if(typeof param == 'undefined') {
    return false;
  } else {
    return true;
  }
}

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
