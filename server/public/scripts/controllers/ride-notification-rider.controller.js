myApp.controller('RiderNotificationController', function($mdDialog, $scope) {
    console.log('RiderNotificationController created');
    var rc = this;
    rc.driver = "james";
    var eta = "10";

    $scope.showDriverMatched = function(ev) {
        $mdDialog.show({
          controller: 'RiderNotificationController',
          templateUrl: 'views/partials/arrive.dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
          $scope.status = answer;
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
      };
      $scope.showDriverArrived = function(ev) {
          $mdDialog.show({
            controller: 'RiderNotificationController',
            templateUrl: 'views/partials/driver-arrive.dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
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
