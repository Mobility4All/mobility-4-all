var express = require('express');
var router = express.Router();
var passport = require('passport'); // probably unnecessary but moving this over from eta.router.js
var path = require('path');
var pool = require('../modules/pool.js');
var driversCoord = {};
var driver = 1;
var riderQueue = [];
var io;


router.matched = function(riderId) {
  console.log("driver and rider matched, terminate the loop");
  // remove from the rider queue
  if(riderQueue.indexOf(riderId) >= 0) {
    riderQueue.splice(riderQueue.indexOf(riderId), 1);
  }
};


var calculateETA = function (rider, driver, callback) {
  console.log('componenets of distanceMatrix:', rider, driver);
  googleMapsClient.distanceMatrix({
    origins: [{lat: driver.st_y, lng: driver.st_x}],  // drivers location NEED TO CONVERT WKB to lat/lng
    destinations: [{lat: rider.coord.latA, lng: rider.coord.lngA}]  // riders location
  })
  .asPromise()
  .then(function(response) {
    eta = response.json.rows[0].elements;
    console.log('matrix test response from the router', response.json.rows);
    callback(eta);
  });
};


// match rider to driver based on (1) driver being live, (2) specific needs, (3) 5 drivers closest to rider
router.get('/match', function(req, res, next) {
  // console.log('matching ride', req.user);
  // console.log('req.socket', req.socket);
  var queryText = ['WITH rider_lng AS (SELECT ST_X(start_location::geometry) AS rlng FROM trips WHERE complete = FALSE AND rider_id = $1), rider_lat AS (SELECT ST_Y(start_location::geometry) AS rlat FROM trips WHERE complete = FALSE AND rider_id = $1) SELECT ST_X(location::geometry), ST_Y(location::geometry), id, driver_socket FROM drivers WHERE live = true'];
  if(req.user.elec_wheelchair) queryText.push(' AND elec_wheelchair = true');
  if(req.user.col_wheelchair) queryText.push(' AND col_wheelchair = true');
  if(req.user.service_animal) queryText.push(' AND service_animal = true');
  if(req.user.oxygen) queryText.push(' AND oxygen = true');
  queryText.push('ORDER BY location <-> st_setsrid(st_makepoint((SELECT rlng FROM rider_lng), (SELECT rlat FROM rider_lat)),4326) LIMIT 5');
  queryText = queryText.join(' ');
  // console.log('query text', queryText);
  req.user.socket_id = req.socket.id;
  req.user.coord = req.coord;
  // store the matched driver-rider ETA in a variable that both rider and driver can access
  // req.user.eta = value;
  if(req.isAuthenticated()) {
    pool.connect(function(err, client, done) {
      if(err) {
        console.log("Error connecting: ", err);
        next(err);
      }
      client.query(queryText, [req.user.id], function(err, result) {
        done();

        if(err) {
          console.log("Error inserting data: ", err);
          res.sendStatus(500);
        } else {
          riderQueue.push(req.user.id);
          console.log('query results', result.rows);
          matchWithDriver(result.rows, req.user);
          res.sendStatus(200);
        }
      });
    });
  }
}
); // end of match route

// Rider (req.user) and drivers (Array) that match criteria by distance
function matchWithDriver(drivers, rider, previousDriver) {
  // console.log("In match with driver", drivers, rider, previousDriver);
  if(riderQueue.indexOf(rider.id) >= 0) {
    if(previousDriver) {
      io.to(previousDriver.driver_socket).emit('remove-accept', rider);
    }
    if(drivers.length > 0) {
      var driver = drivers.shift();
      //rider.eta =
      console.log("Offering ride to driver:", driver);
      calculateETA(rider, driver, function(eta) {
        console.log("inside matchWithDriver eta is:", eta);
        rider.eta = eta;
        io.to(driver.driver_socket).emit('find-driver', rider);
        // This interval is set to 7secs for testing purposes, in production UPDATE INTERVAL
        setTimeout(matchWithDriver, 60000, drivers, rider, driver);
      });
    } else {
      io.to(rider.socket_id).emit('try-again', rider);
    }
  } else {
    // Create a queue of cancelations?
  }
}



// Updates 'accept' value of trip
router.put('/accept', function(req, res, next) {
  var rider = req.body.rider;
  console.log('updating trip accept', rider);
  if(req.isAuthenticated()) {
    pool.connect(function(err, client, done) {
      if(err) {
        console.log("Error connecting: ", err);
        next(err);
      }
      client.query("UPDATE trips SET accept = true WHERE rider_id = $1",
      [rider.id],
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

// Updates 'pickup' value of trip
router.put('/pickup', function(req, res, next) {
  var rider = req.body;
  console.log('updating trip pickup', rider);
  if(req.isAuthenticated()) {
    pool.connect(function(err, client, done) {
      if(err) {
        console.log("Error connecting: ", err);
        next(err);
      }
      client.query("UPDATE trips SET pickup = true WHERE rider_id = $1",
      [rider.id],
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

// Updates 'complete' value of trip
router.put('/complete', function(req, res, next) {
  var rider = req.body;
  console.log('updating trip complete', rider);
  if(req.isAuthenticated()) {
    pool.connect(function(err, client, done) {
      if(err) {
        console.log("Error connecting: ", err);
        next(err);
      }
      client.query("UPDATE trips SET complete = true WHERE rider_id = $1",
      [rider.id],
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

// Deletes user's incomplete trips
router.delete('/delete-incomplete', function(req, res, next) {
  console.log('deleting incomplete trips');
  if(req.isAuthenticated()) {
    pool.connect(function(err, client, done) {
      if(err) {
        console.log("Error connecting: ", err);
        next(err);
      }
      client.query("DELETE FROM trips WHERE rider_id = $1 AND complete = false",
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



//Cat is Sandboxing Google Maps Distance Matrix here//
var distanceMatrixKey = process.env.DISTANCE_MATRIX_KEY || require('../modules/key.config.js').distanceMatrixKey;
var directionsWebServiceKey = process.env.DIR_WEB_SERVICE_KEY || require('../modules/key.config.js').directionsWebServiceKey;

var googleMapsClient = require('@google/maps').createClient({
  key: distanceMatrixKey,
  Promise: Promise
});



module.exports = function(ioIn) {
  io = ioIn;
  return router;
};
