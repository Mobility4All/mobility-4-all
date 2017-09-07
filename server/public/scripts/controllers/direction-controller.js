myApp.controller('DirectionController', function($mdSidenav) {

  console.log('DirectionController created');
  var dc = this;


  function buildToggler(componentId) {
    return function() {
      $mdSidenav(componentId).toggle();
    };
  }
  dc.toggleLeft = buildToggler('left');
  dc.toggleRight = buildToggler('right');


  }); //end of controller
