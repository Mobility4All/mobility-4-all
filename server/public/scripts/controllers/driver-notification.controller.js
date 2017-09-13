// Controller handles partial for showing button for rider arrive, pickup...
myApp.controller('DriverNotificationController', function($http, $mdDialog, $scope, UserService, DataService, NavigationService) {
  console.log('DriverNotificationController created');
  var dc = this;
  // Message displayed on partial
  dc.tripMessage = 'Arrive for ';
  // Imports data from services
  dc.dataService = DataService;
  dc.navigationService = NavigationService;

  var panelEl = angular.element(document.querySelector( '#right-panel' ));

  dc.arrive = function() {
    console.log('arriving for', DataService.rideObject.rider.rider_first);
    riderIdObject = {
      id: DataService.rideObject.rider.id
    }
    if(dc.tripMessage === 'Arrive for ') {
      DataService.arriveForRider();
      dc.tripMessage = 'Pick up ';
      panelEl.empty();
    } else if (dc.tripMessage === 'Pick up '){
      NavigationService.startDestNavigation();
      panelEl.empty();
      dc.tripMessage = 'Drop off ';
      DataService.pickUpRider();
      $http.put('/trip/pickup', riderIdObject).then(function(response) {
        console.log('picked up and updated', response);
      }).catch(function(err) {
        console.log('error updating picked up', err);
      })
    } else if (dc.tripMessage === 'Drop off '){
      $http.put('/trip/complete', riderIdObject).then(function(response) {
        console.log('complete and updated', response);
      }).catch(function(err) {
        console.log('error updating complete', err);
      })
      panelEl.empty();
      DataService.completeRide();
      DataService.buttonShow = false;
    }
  };

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
