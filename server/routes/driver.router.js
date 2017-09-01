var express = require('express');
var router = express.Router();
var path = require('path');
var pool = require('../modules/pool.js');

// Handles driver profile setup request
router.put('/update', function(req, res, next) {
  var driver = req.body;
  // console.log('updating driver', driver, req.user.id);
  if(req.isAuthenticated()) {
    pool.connect(function(err, client, done) {
      if(err) {
        console.log("Error connecting: ", err);
        next(err);
      }
      client.query("UPDATE drivers SET (first_name, last_name, email, phone, street, city, " +
      "state, make, model, license_num, elec_wheelchair, col_wheelchair, service_animal, oxygen, cpr, complete) " +
      "= ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,true) WHERE id = $16",
        [
          driver.first_name, driver.last_name, driver.email, driver.phone, driver.street,
          driver.city, driver.state, driver.make, driver.model, driver.license_num, driver.elec_wheelchair,
          driver.col_wheelchair, driver.service_animal, driver.oxygen, driver.cpr, req.user.id
         ],
          function (err, result) {
            done();

            if(err) {
              console.log("Error inserting data: ", err);
              res.sendStatus(500);
            } else {
              res.sendStatus(200);
            }
          });
    });

  }
});

//Update driver photo url
router.put('/profilephoto', function(req, res, next) {
  var driver = req.body;
  console.log('updating driver photo', driver, req.user.id);
  if(req.isAuthenticated()) {
    pool.connect(function(err, client, done) {
      if(err) {
        console.log("Error connecting: ", err);
        next(err);
      }
      client.query("UPDATE drivers SET driver_photo_url = $1 WHERE id = $2",
        [driver.driver_photo_url, req.user.id],
          function (err, result) {
            done();

            if(err) {
              console.log("Error inserting data: ", err);
              res.sendStatus(500);
            } else {
              res.sendStatus(200);
            }
          });
    });
  }
});

//Update driver photo url
router.put('/vehiclephoto', function(req, res, next) {
  var vehicle = req.body;
  // console.log('updating vehicle photo', vehicle, req.user.id);
  if(req.isAuthenticated()) {
    pool.connect(function(err, client, done) {
      if(err) {
        console.log("Error connecting: ", err);
        next(err);
      }
      client.query("UPDATE drivers SET vehicle_photo_url = $1 WHERE id = $2",
        [vehicle.vehicle_photo_url, req.user.id],
          function (err, result) {
            done();

            if(err) {
              console.log("Error inserting data: ", err);
              res.sendStatus(500);
            } else {
              res.sendStatus(200);
            }
          });
    });
  }
});


router.put('/geolocation', function(req, res, next) {
  console.log('req body coords', req.body);
  var geolocation = req.body;
  console.log('updating driver geolocation', geolocation, req.user.id);
  if(req.isAuthenticated()) {
    pool.connect(function(err, client, done) {
      if(err) {
        console.log("Error connecting: ", err);
        next(err);
      }
      var input = 'SRID=4326;POINT(' + geolocation.lng + ' ' + geolocation.lat + ')';
      client.query("UPDATE drivers SET location = ST_GeographyFromText($1) WHERE id = $2",
        [input, req.user.id],
          function (err, result) {
            done();

            if(err) {
              console.log("Error inserting data: ", err);
              res.sendStatus(500);
            } else {
              res.sendStatus(200);
            }
          });
    });
  }
});

router.put('/live', function(req, res, next) {
  var driverId = req.user.id;
  console.log('switching live status', req.user.id, req.socket.id);
  if(req.isAuthenticated()) {
    pool.connect(function(err, client, done) {
      if(err) {
        console.log("Error connecting: ", err);
        next(err);
      }
      client.query("UPDATE drivers SET live = true, driver_socket = $1 WHERE id = $2",
        [req.socket.id, req.user.id],
          function (err, result) {
            done();

            if(err) {
              console.log("Error inserting data: ", err);
              res.sendStatus(500);
            } else {
              res.sendStatus(200);
            }
          });
    });
  }
});

router.put('/unlive', function(req, res, next) {
  var driverId = req.user.id;
  console.log('switching status to unlive', req.user.id, req.socket.id);
  if(req.isAuthenticated()) {
    pool.connect(function(err, client, done) {
      if(err) {
        console.log("Error connecting: ", err);
        next(err);
      }
      client.query("UPDATE drivers SET live = false, driver_socket = null WHERE id = $1",
        [req.user.id],
          function (err, result) {
            done();

            if(err) {
              console.log("Error inserting data: ", err);
              res.sendStatus(500);
            } else {
              res.sendStatus(200);
            }
          });
    });
  }
});


module.exports = router;
