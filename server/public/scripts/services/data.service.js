myApp.factory('DataService', function($http, $interval, $mdDialog, $mdBottomSheet, $mdToast, UserService){
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
    $mdBottomSheet.show({
      templateUrl: 'views/partials/driver-ride-notification.html',
      controller: NotificationController,
      clickOutsideToClose: false,
      locals: {items: specialNeeds}
    }).then(function(clickedItem) {
      $mdBottomSheet.hide(clickedItem);
    }).catch(function(error) {
      // User clicked outside or hit escape
    });
  };

  // Dialog popup shows rider info to driver on arrival
  function showRiderInfo(ev) {
    console.log('specialNeeds::', specialNeeds);
    // dc.alert = '';
    $mdDialog.show({
      templateUrl: 'views/partials/rider-info.html',
      controller: NotificationController,
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      locals: {items: specialNeeds}
    }).then(function(clickedItem) {
      $mdDialog.hide(clickedItem);
    }).catch(function(error) {
      // User clicked outside or hit escape
    });
  };

  // Controller for ride request and rider info
  function NotificationController($scope, $mdDialog, items) {
    $scope.specialNeeds = items
    $scope.rideObject = rideObject;
    // Countdown value for countdown progress bar
    $scope.acceptCountdown = 100;
    // Decrements progress bar countdown
    $interval(function() {
      $scope.acceptCountdown--;
    }, 300);
    // Handles dialog box hide
    $scope.hide = function() {
      $mdDialog.hide();
    };
    // Handles dialog box cancel/close
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  };

  // Dialog shows to rider on acceptance from driver
  function showDriverMatched(ev) {
    $mdDialog.show({
      controller: 'RiderNotificationController as rc',
      templateUrl: 'views/partials/arrive.dialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:false,
    })
    .then(function(message) {
      rideObject.note = message;
      console.log('sending driver note', message);
      // Sends ride object with note to driver socket
      socket.emit('driver-note', rideObject);
    }, function() {
    });
  };

  // Dialog shows to rider on driver arriving; triggered by driver
  function showDriverArrived(ev) {
    $mdDialog.show({
      controller: 'RiderNotificationController as rc',
      templateUrl: 'views/partials/driver-arrive.dialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:false,
    })
    .then(function(answer) {
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
    }).catch(function(error) {
      // User clicked outside or hit escape
    });
  }

  // Dialog shows rider they need to try request again
  function tryRequestAgain(ev) {
    $mdDialog.show({
      controller: 'RiderNotificationController as rc',
      templateUrl: 'views/partials/tryagain.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:false,
    });
  }



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
      console.log('ride object for request', rideObject);
      // Sends ride request to socket
      socket.emit('ride-request', rideObject);
      // Handles response of ride being accepted
      socket.on('rider-accepted', function(ride) {
        console.log('accepted ride', ride);
        rideObject.driver = ride.driver;
        rideObject.rider = ride.rider;
        showDriverMatched();
      });
      // Handles case where no available drivers have accepted ride
      socket.on('try-again', function(ride) {
        console.log('rider needs to try request again, no drivers accepted', ride);
        tryRequestAgain();
      });
      // Handles rider notification of driver arriving
      socket.on('rider-pickup', function(driver) {
        console.log('rider getting picked up', driver);
        showDriverArrived();
      });
      // Handles showing rider fare dialog upon driver dropoff
      socket.on('fare-dialog', function(ride) {
        console.log('show me the money', ride);
        showRiderFare();
      });
    },
    // Connects driver to socket
    connectDriver: function() {
      socket = io();
      console.log('connected driver to socket', socket);
      // Handles ride request
      socket.on('find-driver', function(rider) {
        console.log("Initially received rider info from server", rider);
        rideObject.rider = rider;
        specialNeeds = [];
        rideObject.driver = UserService.userObject;
        // Checks rider's special needs and adds them to array to be displayed to driver
        if (rideObject.rider.elec_wheelchair) specialNeeds.push('Electric Wheelchair');
        if (rideObject.rider.col_wheelchair) specialNeeds.push('Collapsible Wheelchair');
        if (rideObject.rider.service_animal) specialNeeds.push('Service Animal');
        if (rideObject.rider.oxygen) specialNeeds.push('Oxygen Tank or other Special Equipment');
        console.log('rider info', rider, specialNeeds);
        showRideRequest();
        // Closes waiting for fare dialog
        $mdDialog.cancel();
      });
      // Handles receiving note from rider
      socket.on('receive-note', function(ride) {
        rideObject.note = ride.note;
        console.log('receiving note', ride.note);
      });
      // Hides the bottom sheet from driver when time limit is exceeded
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
    // Handles driver picking up rider
    pickUpRider: function() {
      console.log('driver has picked up rider');
      socket.emit('caregiver-pickup', rideObject);
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
