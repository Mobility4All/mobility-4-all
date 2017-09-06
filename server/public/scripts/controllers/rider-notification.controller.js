
myApp.controller('RiderNotificationController', function(DataService, $timeout, $mdBottomSheet, $mdToast, $mdDialog, $scope) {

    console.log('RiderNotificationController created');
    var rc = this;
    rc.driver = "james";
    var eta = "10";
    rc.rideObject = DataService.rideObject;

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
