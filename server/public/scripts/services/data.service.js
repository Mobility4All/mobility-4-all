myApp.factory('DataService', function($http, UserService){
  console.log('DataService Loaded');
  // Ride object that is sent with ride request
  var rideObject = {
    rider: UserService.userObject
  };
  var socket;

  return {
    rideObject: rideObject,

    socket: socket,
    // Connects rider to socket
    connectRider: function() {
      socket = io();
      console.log('connected rider to socket', socket);
      rideObject.rider_id = socket.id;
      console.log('ride object for request', rideObject, socket.r);
      // Sends ride request to socket
      socket.emit('ride-request', rideObject);
      socket.on('rider-accepted', function(ride) {
        console.log('accepted ride', ride);
      })
    },
    // Connects driver to socket
    connectDriver: function() {
      socket = io();
      console.log('connected driver to socket', socket);
      socket.on('find-driver', function(ride) {
        rideObject = ride;
        rideObject.driver = UserService.userObject;
        console.log(ride);
      })
    },

    acceptRide: function() {
      console.log('accepting ride');
      socket.emit('driver-accept', rideObject);
    },
    // Disconnect rider from socket
    disconnectRider: function() {
      console.log('disconnecting rider from socket', socket);
      socket.disconnect();
    },
    // Disconnect driver from socket
    disconnectDriver: function() {
      console.log('disconnecting driver from socket', socket);
      socket.disconnect();
    }
  };
});
