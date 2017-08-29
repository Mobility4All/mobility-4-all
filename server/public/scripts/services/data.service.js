myApp.factory('DataService', function($http){
  console.log('DataService Loaded');

  var userObject = {};
  var rideObject = {};

  return {
    rideObject: rideObject
  };
});
