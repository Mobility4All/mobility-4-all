myApp.factory('DataService', function(){
  console.log('DataService Loaded');

  var userObject = {};
  var rideObject = {};

  return {
    rideObject: rideObject
  };
});
