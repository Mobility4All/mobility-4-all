// Controller handles partial for showing button for rider arrive, pickup...
myApp.controller('DriverNotificationController', function($http, $mdDialog, DataService, NavigationService) {
  console.log('DriverNotificationController created');
  var dc = this;
  // Message displayed on partial
  dc.tripMessage = 'Arrive for ';
  // Imports data from services
  dc.dataService = DataService;
  dc.navigationService = NavigationService;

  // Handles functionality of driver's arrive/pickup/dropoff button
  dc.arrive = function() {
    console.log('arriving for', DataService.rideObject.rider.rider_first);
    // Object created to track rider's id; used to update trips database
    riderIdObject = {
      id: DataService.rideObject.rider.id
    }
    // Checks what the current message is and performs different actions based on that
    if(dc.tripMessage === 'Arrive for ') {
      DataService.arriveForRider();
      dc.tripMessage = 'Pick up ';
    } else if (dc.tripMessage === 'Pick up '){
      // Starts navigation
      NavigationService.startDestNavigation();
      dc.tripMessage = 'Drop off ';
      DataService.pickUpRider();
      // Updates trip in database
      $http.put('/trip/pickup', riderIdObject).then(function(response) {
        console.log('picked up and updated', response);
      }).catch(function(err) {
        console.log('error updating picked up', err);
      })
    } else if (dc.tripMessage === 'Drop off '){
      // Updates trip in database
      $http.put('/trip/complete', riderIdObject).then(function(response) {
        console.log('complete and updated', response);
      }).catch(function(err) {
        console.log('error updating complete', err);
      })
      DataService.completeRide();
      DataService.buttonShow = false;
    }
  };

  // Dialog box functions
  dc.hide = function() {
    $mdDialog.hide();
  };

  dc.cancel = function() {
    $mdDialog.cancel();
  };

  dc.answer = function(answer) {
    $mdDialog.hide(answer);
  };
});
