myApp.factory('DataService', function($http, UserService){
  console.log('DataService Loaded');

  var rideObject = {
    rider: UserService.userObject.userName
  };
  var socket;

  return {
    rideObject: rideObject,

    socket: socket,

    connectRider: function() {
      socket = io();
      console.log('connected rider to socket', socket);
      socket.emit('ride-request', rideObject)
    },

    connectDriver: function() {
      socket = io();
      console.log('connected driver to socket', socket);
      socket.on('find-driver', function(ride) {
        console.log(ride);
      })
    },



    disconnectRider: function() {
      console.log('disconnecting rider from socket', socket);
      socket.disconnect();
    },

    disconnectDriver: function() {
      console.log('disconnecting driver from socket', socket);
      socket.disconnect();
    }
  };
});
