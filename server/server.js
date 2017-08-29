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

var distanceMatrixRouter = require('./routes/eta.router');

var driverRouter = require('./routes/driver.router');



var port = process.env.PORT || 5000;













// var client = require('twilio')('AC49334531148f62d5745a66859dd83168', 'dba9b29a8f173b3f20b3fe184b1a629a');
//
// app.get('/testtwilio', function(req, res){
//   client.messages.create({
//     to: '+16129864532',
//     from: '+17634029974',
//     body: 'You just got a message from your sweet app'
//   }, function(err, data){
//     if(err)
//       console.log(err);
//     console.log(data);
//   });
// });

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

// Routes
app.use('/eta', distanceMatrixRouter);
app.use('/register', registerRouter);
app.use('/user', userRouter);
app.use('/rider', riderRouter);
app.use('/driver', driverRouter);
app.use('/trip', tripRouter);

// Catch all bucket, must be last!
app.use('/', indexRouter);

// Listen //

var server = app.listen(port, function(){
   console.log('Listening on port:', port);
});

var io = require('socket.io')(server);

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
