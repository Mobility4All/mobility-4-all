myApp.controller('DriverNotificationController', function(UserService, DataService, NavigationService, $http, $mdDialog) {
    console.log('DriverNotificationController created');
    var dc = this;

    dc.tripMessage = 'Arrive for ';
    dc.dataService = DataService;
    dc.navigationService = NavigationService;

    dc.arrive = function() {
      console.log('arriving for', DataService.rideObject.rider.rider_first);
      riderIdObject = {
        id: DataService.rideObject.rider.id
      }
      if(dc.tripMessage === 'Arrive for ') {
        DataService.arriveForRider();
        dc.tripMessage = 'Pick up ';
        //also send rider pickup dialog
        // route here to mark trip arrived
      } else if (dc.tripMessage === 'Pick up '){
        dc.tripMessage = 'Drop off ';
        $http.put('/trip/pickup', riderIdObject).then(function(response) {
          console.log('picked up and updated', response);
        }).catch(function(err) {
          console.log('error updating picked up', err);
        })
        //also starts destination routing
        NavigationService.startDestNavigation();


      } else if (dc.tripMessage === 'Drop off '){
        //also calls rider fare dialog
        $http.put('/trip/complete', riderIdObject).then(function(response) {
          console.log('complete and updated', response);
        }).catch(function(err) {
          console.log('error updating complete', err);
        })
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
