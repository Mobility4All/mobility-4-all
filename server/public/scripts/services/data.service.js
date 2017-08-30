myApp.factory('DataService', function($http){
  console.log('DataService Loaded');

  var rideObject = {};
  var socket;

  return {
    rideObject: rideObject,

    socket: socket,

    connectRider: function() {
      console.log('connecting rider to socket');
      socket = io();
    },

    disconnectRider: function() {
      console.log('disconnecting rider from socket');
      socket.disconnect();
    }
  };
});
