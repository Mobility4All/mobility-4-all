
myApp.controller('RiderNotificationController', function(DataService, $timeout, $mdBottomSheet, $mdToast, $mdDialog, $scope) {

    console.log('RiderNotificationController created');
    var rc = this;
    rc.driver = "james";
    var eta = "10";
    rc.rideObject = DataService.rideObject;

    $scope.showDriverArrived = function(ev) {
        $mdDialog.show({
          controller: 'RiderNotificationController',
          templateUrl: 'views/partials/driver-arrive.dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
          $scope.status = answer;
        }, function() {

        });
      };

    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
});
