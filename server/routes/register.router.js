var express = require('express');
var router = express.Router();
var path = require('path');
var pool = require('../modules/pool.js');
var encryptLib = require('../modules/encryption');

// Handles request for HTML file
router.get('/', function(req, res, next) {
  console.log('get /register route');
  res.sendFile(path.resolve(__dirname, '../public/views/templates/register.html'));
});
/**
* @api{post} /register/rider Register rider user and password to db
* @apiName RiderRegister
* @apiGroup Registration
* @apiVersion 1.0.0
*
* @apiParam {String} saveUser.username Rider's username
* @apiParam {String} saveUser.password Rider's password
*
*@apiSuccess {String} StatusCode Return status code to client.
* @apiUse defaultError
*
*/
// Handles POST request with new user data
router.post('/rider', function(req, res, next) {
  var saveUser = {
    username: req.body.username,
    password: encryptLib.encryptPassword(req.body.password)
  };
  console.log('new user:', saveUser);

  pool.connect(function(err, client, done) {
    if(err) {
      console.log("Error connecting: ", err);
      next(err);
    }
    client.query("INSERT INTO riders (username, password) VALUES ($1, $2) RETURNING id",
      [saveUser.username, saveUser.password],
        function (err, result) {
          client.end();

          if(err) {
            console.log("Error inserting data: ", err);
            next(err);
          } else {
            res.redirect('/');
          }
        });
  });
});
/**
* @api{post} /register/driver Register Driver user and password to db
* @apiName DriverRegister
* @apiGroup Registration
* @apiVersion 1.0.0
*
* @apiParam {String} saveUser.username Rider's username
* @apiParam {String} saveUser.password Rider's password
*
*@apiSuccess {String} StatusCode Return status code to client.
* @apiUse defaultError
*
*/
// Handles POST request with new user data
router.post('/driver', function(req, res, next) {
  var saveUser = {
    username: req.body.username,
    password: encryptLib.encryptPassword(req.body.password)
  };
  console.log('new driver:', saveUser);

  pool.connect(function(err, client, done) {
    if(err) {
      console.log("Error connecting: ", err);
      next(err);
    }
    client.query("INSERT INTO drivers (username, password) VALUES ($1, $2) RETURNING id",
      [saveUser.username, saveUser.password],
        function (err, result) {
          client.end();

          if(err) {
            console.log("Error inserting data: ", err);
            next(err);
          } else {
            res.redirect('/');
          }
        });
  });
});


module.exports = router;
