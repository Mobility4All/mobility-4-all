myApp.factory('DataService', function($http, $mdDialog, $mdBottomSheet, $mdToast, UserService){
  console.log('DataService Loaded');
  // Ride object that is sent with ride request
  var rideObject = {
    rider: UserService.userObject
  };
  // Variable that socket will be assigned to
  var socket;
  // Arrive/pickup partial shows based on this boolean
  var buttonShow = false;

  var specialNeeds = [];


  // Bottom sheet shows on ride request
  function showRideRequest() {
    // dc.alert = '';
    $mdBottomSheet.show({
      templateUrl: 'views/partials/driver-ride-notification.html',
      controller: 'DefaultViewController as dc',
      clickOutsideToClose: false
    }).then(function(clickedItem) {
      $mdBottomSheet.hide(clickedItem);
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

  // Bottom sheet shows on ride request
  function showRiderInfo(ev) {
    // dc.alert = '';
    $mdDialog.show({
      templateUrl: 'views/partials/rider-info.html',
      controller: 'DriverNotificationController as dc',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    }).then(function(clickedItem) {
      $mdDialog.hide(clickedItem);
    }).catch(function(error) {
      // User clicked outside or hit escape
    });
  };

  // Dialog shows to rider on acceptance from driver
  function showDriverMatched(ev) {
      $mdDialog.show({
        controller: 'RiderNotificationController as rc',
        templateUrl: 'views/partials/arrive.dialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:false,
        // fullscreen: rc.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(function(message) {
        // $scope.status = answer;
        rideObject.note = message;
        console.log('sending driver note', message);
        socket.emit('driver-note', rideObject);
      }, function() {
        // $scope.status = 'You cancelled the dialog.';
      });
    };

    // Dialog shows on driver arriving; triggered by driver
    function showDriverArrived(ev) {
      $mdDialog.show({
        controller: 'RiderNotificationController as rc',
        templateUrl: 'views/partials/driver-arrive.dialog.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:false,
        // fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(function(answer) {
        // $scope.status = answer;
      }, function() {

      });
    }
    // Bottom sheet shows rider fare info on ride completion
    function showRiderFare() {
      $mdBottomSheet.show({
        templateUrl: 'views/partials/rider-arrival.html',
        controller: 'RiderNotificationController as rc',
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
    }

    // dialog shows rider they need to try request again
    function tryRequestAgain(ev) {
        $mdDialog.show({
          controller: 'RiderNotificationController as rc',
          templateUrl: 'views/partials/tryagain.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false,
          // fullscreen: rc.customFullscreen // Only for -xs, -sm breakpoints.
        })
        // .then(function(message) {
        //   // $scope.status = answer;
        //   rideObject.note = message;
        //   console.log('sending driver note', message);
        //   socket.emit('driver-note', rideObject);
        // }, function() {
        //   // $scope.status = 'You cancelled the dialog.';
        // });
      };



  return {
    rideObject: rideObject,
    buttonShow: buttonShow,
    socket: socket,
    showDriverMatched: showDriverMatched,
    showDriverArrived: showDriverArrived,
    specialNeeds: specialNeeds,
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
        rideObject.driver = ride.driver;
        showDriverMatched();
      });
      socket.on('try-again', function(ride) {
        console.log('rider needs to try request again, no drivers accepted', ride);
        tryRequestAgain();
      });
      socket.on('rider-pickup', function(driver) {
        console.log('rider getting picked up', driver);
        showDriverArrived();
      });
      socket.on('fare-dialog', function(ride) {
        console.log('show me the money', ride);
        showRiderFare();
      });
    },
    // Connects driver to socket
    connectDriver: function() {
      socket = io();
      console.log('connected driver to socket', socket);
      // Handles ride match
      socket.on('find-driver', function(rider) {
        rideObject.rider = rider;
        rideObject.driver = UserService.userObject; // tbd if this is important
        if (rider.elec_wheelchair) specialNeeds.push('Electric Wheelchair');
        if (rider.col_wheelchair) specialNeeds.push('Collapsible Wheelchair');
        if (rider.service_animal_wheelchair) specialNeeds.push('Service Animal');
        if (rider.oxygen) specialNeeds.push('Oxygen Tank or other Special Equipment');
        console.log('rider info', rider);
        showRideRequest();
      });
      // Handles receiving note from rider
      socket.on('receive-note', function(ride) {
        rideObject.note = ride.note;
        console.log('receiving note', ride.note);
      });
      // Hides the bottom sheet from driver because exceeded time limit to accept ride
      socket.on('remove-accept', function(ride) {
        $mdBottomSheet.hide();
        console.log('remove accept called');
      });
    },
    // Handles driver accepting ride
    acceptRide: function() {
      console.log('accepting ride');
      socket.emit('driver-accept', rideObject);
      $mdBottomSheet.hide();
      // STOP THE MATCHING LOOP
      socket.emit('matched-dr', rideObject);
      // Marks trip accepted in database
      $http.put('/trip/accept', rideObject).then(function(response) {
        console.log('accepted and updated', response);
      }).catch(function(err) {
        console.log('error accepting arrived', err);
      })
    },
    // Handles driver arriving for rider
    arriveForRider: function() {
      showRiderInfo();
      console.log('driver has tapped arrive for rider');
      console.log('special needs', specialNeeds);
      socket.emit('driver-arrive', rideObject);
    },
    // Handles driver completing ride
    completeRide: function() {
      console.log('completing ride');
      socket.emit('complete-ride', rideObject);
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
