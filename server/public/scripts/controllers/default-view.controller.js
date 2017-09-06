myApp.controller('DefaultViewController', function(UserService, DataService, NavigationService, $http, $timeout, $mdBottomSheet,$mdSidenav,$mdDialog, $mdToast, DataService, $scope, $interval) {

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

  $scope.showProgress = function(ev) {
     $mdDialog.show({
       controller: 'DefaultViewController',
       templateUrl: 'views/partials/progress-bar.html',
       parent: angular.element(document.body),
       targetEvent: ev,
       clickOutsideToClose:false,
       fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
     });
   };
   $scope.cancel = function() {
     $mdDialog.cancel();
   };
  function buildToggler(componentId) {
    return function() {
      $mdSidenav(componentId).toggle();
    };
  }
  dc.toggleLeft = buildToggler('left');
  dc.toggleRight = buildToggler('right');




  // //what is this connected to??
  // dc.toggleShow = function() {
  //   NavigationService.buttonShow = !NavigationService.buttonShow;
  // }



}); //end of controller
