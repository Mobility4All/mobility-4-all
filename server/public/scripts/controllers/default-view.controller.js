myApp.controller('DefaultViewController', function(DataService) {
  console.log('DefaultViewController created');
  var dc = this;

  dc.buttonVisible = false;

  dc.toggle = function() {
    if(dc.buttonVisible) {
      DataService.connectRider();
    }
    if(!dc.buttonVisible) {
      DataService.disconnectRider();
    }
    dc.buttonVisible = !dc.buttonVisible;
    console.log(dc.buttonVisible);
  };


  // These functions take in user input for start and end destinations, and returns
  //a google map with polyline route and with text driving directions

  dc.startAndEndInput = {
    start: '',
    end: ''
  }

  //set directions panel div to be an angular element, clear and reset after each new directions req
  dc.panelEl = angular.element( document.querySelector( '#right-panel' ) );


  dc.onClick = function() {
    dc.panelEl.empty();
    initMap();
    console.log(dc.start);
    console.log(dc.end);
  };

  function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 7,
      center: {lat: 41.85, lng: -87.65}
    });
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('right-panel'));
    calculateAndDisplayRoute(directionsService, directionsDisplay);
    //get rid of this code and use data binding with angular instead for start and end point

    function calculateAndDisplayRoute(directionsService, directionsDisplay) {
      directionsService.route({
        origin: dc.start, //have changed from original
        destination: dc.end, //have changed from origi
        travelMode: 'DRIVING'
      }, function(response, status) {
        if (status === 'OK') {
          directionsDisplay.setDirections(response);
          console.log('status ok response', response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
    }

  }; //end of init map function



}); //end of controller
