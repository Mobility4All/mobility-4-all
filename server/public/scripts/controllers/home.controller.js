myApp.controller('HomeController', function($location) {
    console.log('HomeController created');
    var hc = this;

    hc.go = function(url) {
      console.log(url);
      $location.path(`/${url}`)
    }

});
