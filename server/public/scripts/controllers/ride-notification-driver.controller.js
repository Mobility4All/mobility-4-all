myApp.controller('DriverNotificationController', function(UserService) {
    console.log('DriverNotificationController created');
    var dc = this;

    dc.userName = UserService.userObject.userName;
    dc.tripMessage = 'Arrive for ';

    dc.arrive = function() {
      console.log('DriverNotificationController');
      if(dc.tripMessage === 'Arrive for ') {
        console.log(dc.message);
        dc.tripMessage = 'Pick up ';
        //also send rider pickup dialog
      } else if (dc.tripMessage === 'Pick up '){
        dc.tripMessage = 'Drop off ';
        //also starts destination routing
      } else if (dc.tripMessage === 'Drop off '){
        //also calls rider fare dialog
      }
    };

});
