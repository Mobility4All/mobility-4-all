var express = require('express');
var router = express.Router();
var path = require('path');
var pool = require('../modules/pool.js');

// Handles rider profile setup request
router.put('/update', function(req, res, next) {
  var rider = req.body;
  console.log('updating rider', rider, req.user.id);
  if(req.isAuthenticated()) {
    pool.connect(function(err, client, done) {
      if(err) {
        console.log("Error connecting: ", err);
        next(err);
      }
      client.query("UPDATE riders SET (rider_first, rider_last, rider_street, rider_city, rider_state, " +
        "rider_cell, rider_email, wheelchair, service_animal, oxygen, rider_addtl_info, " +
        "cg_first, cg_last, cg_relationship, cg_cell, cg_email, cg_orders_rides, cg_notifications, " +
        "med_id, metmo_id, credit_card_num, credit_cvc, credit_expdate, complete) " +
        "= ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,true) WHERE id = $24",
        [
          rider.rider_first, rider.rider_last, rider.rider_street, rider.rider_city, rider.rider_state,
           rider.rider_cell, rider.rider_email, rider.wheelchair, rider.service_animal,
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


module.exports = router;
