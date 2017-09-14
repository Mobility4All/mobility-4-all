myApp.controller('NavBarController', function($location, UserService, $mdSidenav) {
  console.log('NavBarController created');
  var nb = this;
  nb.userService = UserService;


  //these paths correspond to user views on sidenavdriver.html and sidenavrider.html
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
