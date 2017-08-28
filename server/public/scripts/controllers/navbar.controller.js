myApp.controller('NavBarController', function($scope, $http, $location, UserService, $mdSidenav) {
  console.log('NavBarController created');
  var nb = this;
  nb.userService = UserService;
});
