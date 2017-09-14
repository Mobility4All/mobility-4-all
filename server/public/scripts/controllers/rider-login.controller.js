myApp.controller('RiderLoginController', function($http, $location, UserService, NgMap) {
  console.log('RiderLoginController created');
  var vm = this;
  vm.user = {
    username: '',
    password: '',
    selection:'rider'
  };

  vm.userService = UserService;

  vm.message = '';

  //allows user to sign in
  vm.login = function() {
    if(vm.user.username === '' || vm.user.password === '') {
      vm.message = "Please enter your username and password";
    } else {
      $http.post('/', vm.user).then(function(response) {
        if(response.data.userName) {
          if(!response.data.complete) {
            $location.path('/rider-profile-setup');
          } else {
            $location.path('/on-demand'); // http://localhost:5000/#/user

          }
        } else {
          vm.message = "Wrong username or password";
        }
      }).catch(function(response){
        vm.message = "Wrong username or password";
      });
    }
  };

  //handles rider sign up
  vm.registerUser = function() {
    if(vm.user.username === '' || vm.user.password === '') {
      vm.message = "Choose a username and password";
    } else {
      if (vm.user.selection == 'rider') {
        $http.post('/register/rider', vm.user).then(function(response) {
          $location.path('/rider-login');
        }).catch(function(response) {
          vm.message = "Please try again.";
        });
      } if (vm.user.selection == 'driver') {
        $http.post('/register/driver', vm.user).then(function(response) {
          $location.path('/driver-login');
        }).catch(function(response) {
          vm.message = "Please try again.";
        });
      }
    }
  };


});
