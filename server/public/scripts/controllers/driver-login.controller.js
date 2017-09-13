// Controller for driver login view
myApp.controller('DriverLoginController', function($http, $location, UserService) {
  console.log('DriverLoginController created');
  var vm = this;
  // Creates user object
  vm.user = {
    username: '',
    password: ''
  };
  // Model for error messages
  vm.message = '';

  // Handles driver's login
  vm.login = function() {
    console.log('LoginController -- login');
    // Checks inputs for values
    if(vm.user.username === '' || vm.user.password === '') {
      vm.message = "Enter your username and password!";
    } else {
      // Make http request and error handling
      console.log('LoginController -- login -- sending to server...', vm.user);
      $http.post('/driverlogin', vm.user).then(function(response) {
        if(response.data.userName) {
          console.log('LoginController -- login -- success: ', response.data);
          if(!response.data.complete) {
            $location.path('/driver-profile-setup'); // http://localhost:5000/#/user
          } else {
            $location.path('/default-view');
          }
          // location works with SPA (ng-route)
        } else {
          console.log('LoginController -- login -- failure: ', response);
          vm.message = "Wrong!!";
        }
      }).catch(function(response){
        console.log('LoginController -- registerUser -- failure: ', response);
        vm.message = "Wrong!!";
      });
    }
  };
});
