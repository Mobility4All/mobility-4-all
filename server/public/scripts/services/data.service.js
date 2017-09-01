myApp.factory('DataService', function($http, $mdBottomSheet, $mdToast, UserService){
  console.log('DataService Loaded');
  // Ride object that is sent with ride request
  var rideObject = {
    rider: UserService.userObject
  };
  var socket;
  function showRideRequest() {
    // dc.alert = '';
    $mdBottomSheet.show({
      templateUrl: 'views/partials/driver-ride-notification.html',
      controller: 'ArrivalController',
      clickOutsideToClose: false
    }).then(function(clickedItem) {
      $mdToast.show(
            $mdToast.simple()
              .textContent(clickedItem['name'] + ' clicked!')
              .position('top right')
              .hideDelay(1500)
          );
    }).catch(function(error) {
      // User clicked outside or hit escape
    });
  };



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
      // Handles response of ride being accepted
      socket.on('rider-accepted', function(ride) {
        console.log('accepted ride', ride);
        // add code here to show "driver is on the way" dialog to rider
      });
      socket.on('rider-pickup', function(driver) {
        console.log('rider getting picked up', driver);
      });
    },
    // Connects driver to socket
    connectDriver: function() {
      socket = io();
      console.log('connected driver to socket', socket);
      socket.on('find-driver', function(rider) {
        rideObject.rider = rider;
        rideObject.driver = UserService.userObject; // tbd if this is important
        console.log('rider info', rider);
        showRideRequest();
      })
    },
    // Handles driver accepting ride
    acceptRide: function() {
      console.log('accepting ride');
      socket.emit('driver-accept', rideObject);
    },
    // Handles driver arriving for rider
    arriveForRider: function() {
      console.log('driver has tapped arrive for rider');
      socket.emit('driver-arrive', rideObject);
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
