myApp.controller('DefaultViewController', function(DataService, $http, $scope, $interval) {
  console.log('DefaultViewController created');
  var dc = this;

  dc.buttonVisible = true;

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

  //HTML 5 geolocation pure JS

  dc.message = '';
  dc.coords = {
    lat: '',
    lng: ''
  };


  dc.geoLocate = function() {
    console.log('update location function called');

    getLocation();

    function showPosition(position) {
      dc.message = "Latitude:  " + position.coords.latitude + "  Longitude: " + position.coords.longitude + "";
      $scope.$apply();
      console.log('position coords', position.coords);
      dc.coords.lat = position.coords.latitude;
      dc.coords.lng = position.coords.longitude;
      console.log('dc.coords', dc.coords);
      updateDriverLocation();
    } // end show position function

    function getLocation () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        dc.message = "Geolocation is not supported by this browser.";
      }
    } //end of getLocation fn


  } //end geolocat

  //end of html5 geo



  function updateDriverLocation() {
    $http.put('/driver/geolocation', dc.coords).then(function(response) {
      console.log('update location -- success', response);
    })
  } //end put req

}); //end of controller
