myApp.controller('RidePurposeController', function(DataService, $location) {
    console.log('RidePurposeController created');
    var rc = this;
    rc.ride = {};
    rc.message = '';

    rc.updatePurpose = function(purpose) {
      rc.ride.purpose = purpose;
      console.log('ride purpose', rc.ride.purpose);
    }

    rc.confirmPurpose = function() {
      console.log('confirming purpose');
      if (rc.ride.purpose) {
        DataService.rideObject.purpose = rc.ride.purpose;
        console.log('data ride:', DataService.rideObject.purpose);
        $location.path('/input-ride')
      } else {
        rc.message = 'Please select a purpose'
      }
    }
});
