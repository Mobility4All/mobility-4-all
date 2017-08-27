myApp.controller('RiderProfileController', function($http) {
    console.log('RiderProfileController created');
    var rc = this;

    // Set default checkbox behavior
    rc.caregiver = false;
    // Intiialize empty user object
    rc.user = {};

    // List of states abbreviations for dropdown select
    rc.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
            'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
            'WY').split(' ').map(function (state) { return { abbrev: state }; }
    );

    // Updates rider profile after setup
    rc.updateUser = function() {
      console.log(rc.user);
      $http.put('/rider/update', rc.user).then(function(response) {
        console.log('updated rider', response);
      }).catch(function(response) {
        console.log('update rider error', response);
      })
    }
});
