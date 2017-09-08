myApp.controller('DriverNotificationController', function(UserService, DataService, NavigationService, $http, $mdDialog) {
    console.log('DriverNotificationController created');
    var dc = this;

    dc.tripMessage = 'Arrive for ';
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
        //also send rider pickup dialog
        // route here to mark trip arrived
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
        //also starts destination routing


      } else if (dc.tripMessage === 'Drop off '){
        //also calls rider fare dialog
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
