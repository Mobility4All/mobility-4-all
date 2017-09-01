myApp.controller('ArrivalController', function(DataService, $timeout, $mdBottomSheet) {
    console.log('ArrivalController created');
    var ac = this;
    ac.riderInfo = DataService.rideObject.rider;


});
