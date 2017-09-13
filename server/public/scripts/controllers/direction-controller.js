// Controller for turn by turn direction sidenav
myApp.controller('DirectionController', function() {

  console.log('DirectionController created');
  var dc = this;

  // Handles toggling of turn by turn navigation sidenav
  function buildToggler(componentId) {
    return function() {
      $mdSidenav(componentId).toggle();
    };
  }
  dc.toggleLeft = buildToggler('left');
  dc.toggleRight = buildToggler('right');


}); //end of controller
