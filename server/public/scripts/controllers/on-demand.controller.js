myApp.controller('OnDemandController', function($http) {
    console.log('OnDemandController created');
    var oc = this;

    oc.testMatch = function() {
      console.log('finding matched ride');
      $http.get('/trip/match').then(function(response) {
        console.log('response from match', response);
      })
    }
});
