myApp.controller('ArrivalController', function($timeout, $mdBottomSheet) {
    console.log('ArrivalController created');
    var ac = this;
    ac.alert = '';

    ac.items = [
    ];
    ac.listItemClick = function($index) {
      var clickedItem = ac.items[$index];
      $mdBottomSheet.hide(clickedItem);
    };



});
