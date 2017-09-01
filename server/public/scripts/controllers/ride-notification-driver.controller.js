myApp.controller('DriverNotificationController', function(UserService, DataService) {
    console.log('DriverNotificationController created');
    var dc = this;

    dc.userName = UserService.userObject.userName;
    dc.tripMessage = 'Arrive for ';

    dc.arrive = function() {
      console.log('DriverNotificationController');
      if(dc.tripMessage === 'Arrive for ') {
        DataService.arriveForRider(); // this is displaying to the driver... not the rider
        console.log(dc.message);
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
