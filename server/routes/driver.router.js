var express = require('express');
var router = express.Router();
var path = require('path');
var pool = require('../modules/pool.js');

// Handles driver profile setup request
router.put('/update', function(req, res, next) {
  var driver = req.body;
  console.log('updating driver', driver, req.user.id);
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
  console.log('updating vehicle photo', vehicle, req.user.id);
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



module.exports = router;
