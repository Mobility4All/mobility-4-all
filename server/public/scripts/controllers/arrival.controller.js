myApp.controller('ArrivalController', function($timeout, $mdBottomSheet, $mdToast) {
    console.log('ArrivalController created');
    var ac = this;
    ac.alert = '';

    ac.items = [
      { name: 'Hangout', icon: 'hangout' },
      { name: 'Mail', icon: 'mail' },
      { name: 'Message', icon: 'message' },
      { name: 'Copy', icon: 'copy2' },
      { name: 'Facebook', icon: 'facebook' },
      { name: 'Twitter', icon: 'twitter' },
    ];
    ac.listItemClick = function($index) {
      var clickedItem = ac.items[$index];
      $mdBottomSheet.hide(clickedItem);
    };



});
