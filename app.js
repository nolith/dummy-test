var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app = express();

var calibrations = [
{
  id: 1,
  operator: "Gianni",
  part_number: "123",
  machine_parameters: [1200.2345, 0.0021, 13.7, 270],
  geometrical_dimension: [134.23, 0.35],
  result: "recalibrate",
  suggested_parameters: [1200.2500, 0.0024, 13.7, 270]
},
{
  id: 2,
  operator: "Gianni",
  part_number: "123",
  machine_parameters: [1200.2500, 0.0024, 13.7, 270],
  geometrical_dimension: [134.33, 0.38],
  result: "ok",
  suggested_parameters: [1200.2500, 0.0024, 13.7, 270]
}];

// parse application/json
app.use(bodyParser.json());

//logging
app.use(morgan('dev'))

app.get('/', function(req, res) {
    res.send("Dummy Test");
});

app.get('/calibrations', function(req, res) {
  res.json(calibrations);
});

app.get('/calibrations/:id', function(req, res) {
  if(calibrations.length <= req.params.id || req.params.id < 0) {
    res.statusCode = 404;
    return res.send('Error 404: No calibration found');
  }

  var c = calibrations[req.params.id];
  res.json(c);
});

app.post('/calibrations', function(req, res) {
  console.log(req.body);
  if( !req.body.hasOwnProperty('operator') ||
      !req.body.hasOwnProperty('part_number') ||
      !req.body.hasOwnProperty('geometrical_dimension') ||
      !req.body.hasOwnProperty('machine_parameters') ||
      !Array.isArray(req.body.machine_parameters) ||
      !Array.isArray(req.body.geometrical_dimension) ||
      req.body.machine_parameters.length != 4 ||
      req.body.geometrical_dimension.length != 2 ) {

    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect.');
  }

  var newCalibration = {
    id: calibrations.length + 1,
    operator: req.body.operator,
    part_number : req.body.part_number,
    machine_parameters: req.body.machine_parameters,
    geometrical_dimension: req.body.geometrical_dimension,
    result: "ok",
    suggested_parameters: req.body.machine_parameters
  };

  calibrations.push(newCalibration);
  res.json(newCalibration);
});

var server = app.listen(process.env.PORT || 3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Dummy Test app listening at http://%s:%s', host, port)

});
