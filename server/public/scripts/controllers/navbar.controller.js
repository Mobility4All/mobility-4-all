myApp.controller('NavBarController', function($scope, $http, $location, UserService, $mdSidenav) {
  console.log('NavBarController created');
  var nb = this;
  nb.userService = UserService;

  nb.navToDefault = function () {
    $location.path('/default-view');
  };
  nb.navToContact = function () {
    $location.path('/contact');
  };
  nb.navToAboutDriver = function () {
    $location.path('/aboutdriver');
  };
  nb.navRiderProfile = function () {
    $location.path('/rider-profile-setup');
  };
  nb.navRiderReq = function () {
    $location.path('/on-demand');
  };
  nb.navRiderAbout = function () {
    $location.path('/aboutrider');
  };
});
