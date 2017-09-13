var express = require('express');
var router = express.Router();
var path = require('path');
var pool = require('../modules/pool.js');

/**
 * @apiDefine defaultError Test title
 * @apiError UserNotFound The <code>id</code> of the User was not found.
 * @apiError (Error 5xx) ServerError The server encountered an unexpected condition which prevented it from fulfilling the request.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */


/**
* @api{put} /driver/update Update Driver Profile
* @apiName DriverUpdate
* @apiGroup Driver
* @apiVersion 1.0.0
*
* @apiPermission user-driver
*
* @apiParam {String} first_name Drivers first name.
* @apiParam {String} last_name Drivers last name.
* @apiParam {String} email Drivers email address.
* @apiParam {String} phone Drivers cell phone.
* @apiParam {String} street Drivers street.
* @apiParam {String} city Drivers city.
* @apiParam {String} state Drivers state.
* @apiParam {String} make Drivers vehicle make.
* @apiParam {String} model Drivers vehicle model.
* @apiParam {String} license num Drivers vehicle license num.
* @apiParam {Boolean} elec_wheelchair Does driver accomdate riders with: elec_wheelchair.
* @apiParam {Boolean} col_wheelchair Does driver accomdate riders with: col_wheelchair.
* @apiParam {Boolean} service_animal Does driver accomdate riders with: service_animal.
* @apiParam {Boolean} oxygen Does driver accomdate riders with: oxygen.
* @apiParam {Boolean} cpr Does driver accomdate riders with: cpr needs.
* @apiParam {Boolean} complete Did driver complete the profile build.
* @apiParam {Integer} id Drivers db id.
*
*
* @apiSuccess {String} StatusCode Return status code to client.
*
* @apiUse defaultError
*
*/
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


/**
* @api{put} /driver/profilephoto Update Driver Profile Photo
* @apiName DriverProfilePhoto
* @apiGroup Driver
* @apiVersion 1.0.0
*
* @apiPermission user-driver
*
* @apiParam {String} driver_photo_url Drivers profile photo.
* @apiParam {Integer} req.user.id Drivers id.
*
* @apiSuccess {String} StatusCode Return status code to client.
* @apiUse defaultError
*/
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

/**
* @api{put} /driver/vehiclephoto Update Driver Vehicle Photo
* @apiName DriverVehiclePhoto
* @apiGroup Driver
* @apiVersion 1.0.0
*
* @apiPermission user-driver
*
* @apiParam {String} vehicle_photo_url Drivers vehicle photo.
* @apiParam {Integer} req.user.id Drivers id.
*
* @apiSuccess {String} StatusCode Return status code to client.
* @apiUse defaultError
*/
//Update driver vehicle url
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

/**
* @api{put} /driver/geolocation Update Driver Geolocation
* @apiName DriverGeolocation
* @apiGroup Driver
* @apiVersion 1.0.0
*
* @apiPermission user-driver
*
* @apiParam {Integer} geolocation Drivers latitude and longitude from HTML5 geolocation request.
* @apiParam {Integer} req.user.id Drivers id.
*
* @apiSuccess {String} StatusCode Return status code to client.
* @apiUse defaultError
*/
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


/**
* @api{put} /driver/live Update Driver Status to Live and set Socket Id
* @apiName DriverLiveStatus
* @apiGroup Driver
* @apiVersion 1.0.0
*
* @apiPermission user-driver
*
* @apiParam {Integer} req.socket.id Drivers socket id, passed through on req.
* @apiParam {Integer} req.user.id Drivers user id, passed through on req.
*
* @apiSuccess {String} StatusCode Return status code to client.
* @apiUse defaultError
*/
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

/**
* @api{put} /driver/unlive Update Driver Status to Unlive
* @apiName DriverUnLiveStatus
* @apiGroup Driver
* @apiVersion 1.0.0
*
* @apiPermission user-driver
*
* @apiParam {Integer} req.user.id Drivers user id, passed through on req.
*
* @apiSuccess {String} StatusCode Return status code to client.
* @apiUse defaultError
*/
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
