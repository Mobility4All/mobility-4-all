
myApp.controller('RiderNotificationController', function($mdBottomSheet, $mdDialog, DataService) {

    console.log('RiderNotificationController created');
    var rc = this;
    rc.driver = "james";
    var eta = "10";
    rc.rideObject = DataService.rideObject;

//this controller handles all dialog boxes the rider sees
    rc.hide = function() {
      $mdDialog.hide();
    };

    rc.cancel = function() {
      $mdDialog.cancel();
    };

    rc.answer = function(answer) {
      $mdDialog.hide(answer);
    };

    rc.hideFare = function() {
      $mdBottomSheet.hide();
    }
});
