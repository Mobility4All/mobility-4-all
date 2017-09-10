var express = require('express');
var router = express.Router();
var path = require('path');
var pool = require('../modules/pool.js');


/**
* @api{put} /rider/update Update Rider Profile
* @apiName RiderUpdate
* @apiGroup Rider
* @apiVersion 1.0.0
*
* @apiParam {String} rider_first Rider's first name.
* @apiParam {String} rider_last Rider's last name.
* @apiParam {String} rider_street Rider's street.
* @apiParam {String} rider_city Rider's city.
* @apiParam {String} rider_state Rider's state.
* @apiParam {String} rider_cell Rider's cell.
* @apiParam {String} rider_email Rider's email.
* @apiParam {Boolean} elec_wheelchair Does rider have an electric wheelchair.
* @apiParam {Boolean} col_wheelchair Does rider have a collapsable wheelchair.
* @apiParam {Boolean} service_animal Does rider have a service animal.
* @apiParam {Boolean} oxygen Does rider have an oxygen tank.
* @apiParam {String} rider_addtl_info Rider's additional information for driver.
* @apiParam {String} cg_first Rider's Caregiver first name.
* @apiParam {String} cg_last Rider's Caregiver last name.
* @apiParam {String} cg_relationship Riders Caregiver relationship to rider.
* @apiParam {String} cg_cell Rider's Caregiver cell number.
* @apiParam {String} cg_email Rider's Caregiver email.
* @apiParam {Boolean} cg_orders_rides Gives Caregiver authority to order rides.
* @apiParam {Boolean} cg_financial_auth Gives Caregiver authority over payments and financial information.
* @apiParam {Boolean} cg_notifications Caregiver gets notifications when rider picked up and dropped off.
* @apiParam {String} med_id Rider's medical ID
* @apiParam {String} metmo_id Rider's Metro Mobility ID
* @apiParam {String} credit_card_num Rider's Credit Card Number
* @apiParam {String} credit_cvc Rider's Credit Card security number
* @apiParam {String} credit_expdate Rider's Credit Card Exp Date
* @apiParam {Boolean} complete Rider's profile complete, If yes Rider will not be prompted to set up profile on first login.
* @apiParam {Integer} id Rider's db id.
*
*
* @apiSuccess {String} StatusCode Return status code to client.
*/
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
      "cg_first, cg_last, cg_relationship, cg_cell, cg_email, cg_orders_rides, cg_financial_auth, cg_notifications, " +
      "med_id, metmo_id, credit_card_num, credit_cvc, credit_expdate, complete) " +
      "= ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,true) WHERE id = $25",
      [
        rider.rider_first, rider.rider_last, rider.rider_street, rider.rider_city, rider.rider_state,
        rider.rider_cell, rider.rider_email, rider.elec_wheelchair, rider.col_wheelchair, rider.service_animal,
        rider.oxygen, rider.rider_addtl_info, rider.cg_first, rider.cg_last,
        rider.cg_relationship, rider.cg_cell, rider.cg_email, rider.cg_orders_rides, cg_financial_auth,
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
/**
* @api{put} /rider/photo Update Rider Profile photo
* @apiName RiderUpdatePhoto
* @apiGroup Rider
* @apiVersion 1.0.0
*
* @apiParam {String} rider.rider_photo_url Rider's picture from filestack.
* @apiParam {Integer} req.user.id Rider's db id.
*
*@apiSuccess {String} StatusCode Return status code to client.
*
*/
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
/**
* @api{post} /rider/destAB Send Location data for Rider to the Database.
* @apiName RiderUpdatePhoto
* @apiGroup Rider
* @apiVersion 1.0.0
*
* @apiParam {Integer} rider_id Rider's db id.
* @apiParam {String} start_location Rider's pickup location.
* @apiParam {String} end_location Rider's dropoff location.
* @apiParam {String} rider_note Rider's Additional note to driver about the current ride.
*
*@apiSuccess {String} StatusCode Return status code to client.
*
*/
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
