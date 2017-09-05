var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var passport = require('./strategies/sql.localstrategy');
var sessionConfig = require('./modules/session.config');

// Route includes
var indexRouter = require('./routes/index.router');
var userRouter = require('./routes/user.router');
var registerRouter = require('./routes/register.router');
var riderRouter = require('./routes/rider.router');
var tripRouter = require('./routes/trip.router');
var driverRouter = require('./routes/driver.router');

var config = require('./modules/twilio.config');
var client = require('twilio')(config.accountSid, config.authToken);

var port = process.env.PORT || 5000;


// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Serve back static files
app.use(express.static('./server/public'));

// Passport Session Configuration
app.use(sessionConfig);

// Start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Listen //

var server = app.listen(port, function(){
   console.log('Listening on port:', port);
});

var io = require('socket.io')(server);
var userSocket;
var coord;
// Handles socket requests
io.on('connection', function(socket){
  console.log('a user connected', socket.id);
  userSocket = socket;
  // When user disconnects
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  // Emits ride data to drivers on request
  socket.on('ride-request', function(data) {
    console.log('ride request data', data);
    // Assigns coordinates to global variable
    coord = {
      latA: data.latA,
      latB: data.latB,
      lngA: data.lngA,
      lngB: data.lngB
    };
    data.rider_id = socket.id;
  });
  // Sends rider note to driver
  socket.on('driver-note', function(data) {
    console.log('driver note', data);
    io.to(data.driver.driver_socket).emit('receive-note', data);
  });
  // Sends driver info to rider
  socket.on('driver-accept', function(data) {
    data.driver.driver_socket = socket.id;
    console.log('ride acceptance data', data);
    io.to(data.rider.socket_id).emit('rider-accepted', data);
    // terminate matching loop in trip.router.js
    tripRouter.matched();
  });
  // listening for arriveForRider
  socket.on('driver-arrive', function(data) {
    console.log('driver arrive socket listening', data);
    io.to(data.rider.socket_id).emit('rider-pickup', data);
    if (data.rider.cg_cell && data.rider.cg_notifications){
      notifyCaregiverPickup(data.rider.cg_cell, data.rider.rider_first);
      }
  });
  // Listening for ride to completeRide
  socket.on('complete-ride', function(data) {
    console.log('completing ride', data);
    io.to(data.rider.socket_id).emit('fare-dialog', data);
    if (data.rider.cg_cell && data.rider.cg_notifications){
      notifyCaregiverDropoff(data.rider.cg_cell, data.rider.rider_first);
      }
  });
});

// Assigns properties to req object to make available to routers
app.use(function(req, res, next) {
  req.io = io;
  req.coord = coord;
  req.socket = userSocket;
  next();
});

// Routes
app.use('/register', registerRouter);
app.use('/user', userRouter);
app.use('/rider', riderRouter);
app.use('/driver', driverRouter);
app.use('/trip', tripRouter);
// tripRouter(app, io);

function notifyCaregiverPickup(to, rider) {
  //console.log(to, rider, config.sendingNumber + " care giver notified");
  return client.api.messages
    .create({
      body: rider + " has been picked up.",
      to: to,
      from: config.sendingNumber,
    }).then(function(data) {
      console.log('Administrator notified');
    }).catch(function(err) {
      console.error('Could not notify administrator');
      console.error(err);
    });
};

function notifyCaregiverDropoff(to, rider) {
  //console.log(to, rider, config.sendingNumber + " care giver notified");
  return client.api.messages
    .create({
      body: rider + " has arrived at their destination.",
      to: to,
      from: config.sendingNumber,
    }).then(function(data) {
      console.log('Administrator notified');
    }).catch(function(err) {
      console.error('Could not notify administrator');
      console.error(err);
    });
};


// Catch all bucket, must be last!
app.use('/', indexRouter);
