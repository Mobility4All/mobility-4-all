myApp.controller('DefaultViewController', function(UserService, DataService, NavigationService, $http, $timeout, $mdBottomSheet,$mdSidenav, $mdToast, DataService, $scope, $interval) {

  console.log('DefaultViewController created');
  var dc = this;
  dc.riderInfo = DataService.rideObject.rider;
  dc.dataService = DataService;
  dc.navigationService = NavigationService;

  dc.currentlyOffline = true;
  //toggle function to show driver online and golive
  dc.toggleOnline = function() {
    if(dc.currentlyOffline) {
      $http.put('/driver/live/');
      DataService.connectDriver();
      NavigationService.callInterval();
    }
    if(!dc.currentlyOffline) {
      $http.put('/driver/unlive/');
      DataService.disconnectDriver();
    }
    dc.currentlyOffline = !dc.currentlyOffline;
    console.log(dc.currentlyOffline);
  };


  function buildToggler(componentId) {
    return function() {
      $mdSidenav(componentId).toggle();
    };
  }
  dc.toggleLeft = buildToggler('left');
  dc.toggleRight = buildToggler('right');




}); //end of controller
