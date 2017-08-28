myApp.controller('HomeController', function($location, UserService) {
    console.log('HomeController created');
    var hc = this;

    hc.go = function(url) {
      console.log(url);
      $location.path('/' + url);
    };
    hc.userService = UserService;
});
