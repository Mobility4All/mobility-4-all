myApp.controller('RiderNotificationController', function($timeout, $mdBottomSheet, $mdToast) {
    console.log('RiderNotificationController created');
    var rc = this;

    //hide/show current fare price at the end of the ride
    rc.showGridBottomSheet = function() {
      rc.alert = '';
      $mdBottomSheet.show({
        templateUrl: 'views/partials/rider-arrival.html',
        controller: 'ArrivalController',
        clickOutsideToClose: false
      }).then(function(clickedItem) {
        $mdToast.show(
              $mdToast.simple()
                .textContent(clickedItem['name'] + ' clicked!')
                .position('top right')
                .hideDelay(1500)
            );
      }).catch(function(error) {
        // User clicked outside or hit escape
      });
    };
});
