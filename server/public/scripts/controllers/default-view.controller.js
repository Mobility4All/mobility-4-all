myApp.controller('DefaultViewController', function($http, $mdDialog, $scope, DataService, NavigationService) {

  console.log('DefaultViewController created');
  var dc = this;
  dc.riderInfo = DataService.rideObject.rider;
  dc.dataService = DataService;
  dc.navigationService = NavigationService;
  dc.specialNeeds = DataService.specialNeeds;

  dc.currentlyOffline = true;
  // Toggle function to show driver online and golive
  dc.toggleOnline = function() {
    // If currently offline, updates status to live in database, connects driver to socket
    // and update driver location on interval
    if(dc.currentlyOffline) {
      $http.put('/driver/live/');
      DataService.connectDriver();
      NavigationService.callInterval();
    }
    // If driver currently online, updates status to offline in database and disconnects from socket
    if(!dc.currentlyOffline) {
      $http.put('/driver/unlive/');
      DataService.disconnectDriver();
    }
    // Toggles live status
    dc.currentlyOffline = !dc.currentlyOffline;
    console.log(dc.currentlyOffline);
  };

  // Handles searching for fare dialog
  $scope.showProgress = function(ev) {
     $mdDialog.show({
       controller: 'DefaultViewController',
       templateUrl: 'views/partials/progress-bar.html',
       parent: angular.element(document.body),
       targetEvent: ev,
       clickOutsideToClose:false,
       fullscreen: $scope.customFullscreen
     });
   };
   // Closes dialog box
   $scope.cancel = function() {
     $mdDialog.cancel();
   };
}); //end of controller
