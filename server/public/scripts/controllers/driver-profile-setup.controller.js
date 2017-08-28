myApp.controller('DriverProfileController', function($http) {
    console.log('DriverProfileController created');
    var dc = this;

    // Intiialize empty user object
    dc.user = {};

    // List of states abbreviations for dropdown select
    dc.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
            'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
            'WY').split(' ').map(function (state) { return { abbrev: state }; }
    );

    // Updates driver profile after setup
    dc.updateDriver = function() {
      console.log(dc.user);
      $http.put('/driver/update', dc.user).then(function(response) {
        console.log('updated driver', response);
      }).catch(function(response) {
        console.log('update driver error', response);
      })
    }
});
