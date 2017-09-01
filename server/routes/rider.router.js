var express = require('express');
var router = express.Router();
var path = require('path');
var pool = require('../modules/pool.js');

// Handles rider profile setup request
router.put('/update', function(req, res, next) {
  var rider = req.body;
  // console.log('updating rider', rider, req.user.id);
  if(req.isAuthenticated()) {
    pool.connect(function(err, client, done) {
      if(err) {
        console.log("Error connecting: ", err);
        next(err);
      }
      client.query("UPDATE riders SET (rider_first, rider_last, rider_street, rider_city, rider_state, " +
      "rider_cell, rider_email, elec_wheelchair, col_wheelchair, service_animal, oxygen, rider_addtl_info, " +
      "cg_first, cg_last, cg_relationship, cg_cell, cg_email, cg_orders_rides, cg_notifications, " +
      "med_id, metmo_id, credit_card_num, credit_cvc, credit_expdate, complete) " +
      "= ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,true) WHERE id = $25",
      [
        rider.rider_first, rider.rider_last, rider.rider_street, rider.rider_city, rider.rider_state,
        rider.rider_cell, rider.rider_email, rider.elec_wheelchair, rider.col_wheelchair, rider.service_animal,
        rider.oxygen, rider.rider_addtl_info, rider.cg_first, rider.cg_last,
        rider.cg_relationship, rider.cg_cell, rider.cg_email, rider.cg_orders_rides,
        rider.cg_notifications, rider.med_id, rider.metmo_id,
        rider.credit_card_num, rider.credit_cvc, rider.credit_expdate,
        req.user.id
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

router.put('/photo', function(req, res, next) {
  var rider = req.body;
  // console.log('updating rider photo', rider, req.user.id);
  if(req.isAuthenticated()) {
    pool.connect(function(err, client, done) {
      if(err) {
        console.log("Error connecting: ", err);
        next(err);
      }
      client.query("UPDATE riders SET rider_photo_url = $1 WHERE id = $2",
      [rider.rider_photo_url, req.user.id],
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

router.post('/destAB', function(req, res, next) {
  var ride = req.body;
  console.log('save rider AB geolocations', ride, req.user.id);
  console.log('save rider AB geolocations', ride, req.user.id);
  console.log('save rider AB geolocations...type:', typeof ride.latA, req.user.id);
  if(req.isAuthenticated()) {
    pool.connect(function(err, client, done) {
      if(err) {
        console.log("Error connecting: ", err);
        next(err);
      }
      var inputA = 'SRID=4326;POINT(' + ride.lngA + ' ' + ride.latA + ')';
      var inputB = 'SRID=4326;POINT(' + ride.lngB + ' ' + ride.latB + ')';
      console.log("inputA:", inputA);
      console.log("inputB:", inputB);
      client.query('INSERT INTO "trips" ("rider_id", "start_location", "end_location", "rider_note") VALUES ($1, ST_GeographyFromText($2), ST_GeographyFromText($3), $4);',
      [req.user.id, inputA, inputB, req.user.id],
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
