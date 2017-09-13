myApp.controller('DefaultViewController', function($http, $mdDialog, $scope, UserService, DataService, NavigationService) {

  console.log('DefaultViewController created');
  var dc = this;
  dc.riderInfo = DataService.rideObject.rider;
  dc.dataService = DataService;
  dc.navigationService = NavigationService;
  dc.specialNeeds = DataService.specialNeeds;

  dc.currentlyOffline = true;
  //toggle function to show driver online and golive
  //driver status is updated in the database
  //when driver goes live, driver location is tracked on an interval and sent to DB
  dc.toggleOnline = function() {
    if(dc.currentlyOffline) {
      $http.put('/driver/live/');
      DataService.connectDriver();
      NavigationService.updateLocationInterval();
    }
    if(!dc.currentlyOffline) {
      $http.put('/driver/unlive/');
      DataService.disconnectDriver();
    }
    dc.currentlyOffline = !dc.currentlyOffline;
    console.log(dc.currentlyOffline);
  };

//ShowProgress will show the driver how much time they have left to accept a ride req
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


}); //end of controller
