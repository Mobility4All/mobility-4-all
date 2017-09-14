myApp.controller('HomeController', function($location, UserService) {
  console.log('HomeController created');
  var hc = this;

  //this function directs user from home page (home.html)to sign in as a rider or driver
  //or to sign up with a new acount. This creates seperate user paths for drivers and riders
  hc.go = function(url) {
    console.log(url);
    $location.path('/' + url);
  };
  hc.userService = UserService;
});
