myApp.controller('DriverNotificationController', function(UserService, DataService) {
    console.log('DriverNotificationController created');
    var dc = this;

    dc.userName = DataService.rideObject.rider.rider_first;
    dc.tripMessage = 'Arrive for ';

    dc.arrive = function() {
      console.log('arriving for', DataService.rideObject.rider.rider_first);
      if(dc.tripMessage === 'Arrive for ') {
        DataService.arriveForRider();
        console.log(dc.tripMessage);
        dc.tripMessage = 'Pick up ';
        //also send rider pickup dialog
        // route here to mark trip arrived
      } else if (dc.tripMessage === 'Pick up '){
        dc.tripMessage = 'Drop off ';
        //also starts destination routing
      } else if (dc.tripMessage === 'Drop off '){
        //also calls rider fare dialog
      }
    };

});
