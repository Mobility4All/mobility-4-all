myApp.controller('HomeController', function($location, $scope, NgMap) {
    console.log('HomeController created');
    var hc = this;

    hc.go = function(url) {
      console.log(url);
      $location.path(`/${url}`)
    };

    $scope.result1 = 'initial value';
    $scope.options1 = null;
    $scope.details1 = '';

    NgMap.getMap().then(function(map) {
      console.log(map.getCenter());
      console.log('markers', map.markers);
      console.log('shapes', map.shapes);
  });

});
