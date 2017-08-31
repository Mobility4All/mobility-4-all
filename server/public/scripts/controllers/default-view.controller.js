myApp.controller('DefaultViewController', function(UserService, DataService, $http, $scope, $interval) {
  console.log('DefaultViewController created');
  var dc = this;

  dc.buttonVisible = true;

  dc.toggle = function() {
    if(dc.buttonVisible) {
      $http.put('/driver/live/');
      DataService.connectDriver();
    }
    if(!dc.buttonVisible) {
      $http.put('/driver/unlive/');
      DataService.disconnectDriver();
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

  } //end of init map function

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
  }; //end geolocat
  //end of html5 geo


  $scope.callInterval = function() {
  //Show current seconds value 5 times after every 1000 ms
  $interval(dc.geoLocate, 60000);
};


  function updateDriverLocation() {
    $http.put('/driver/geolocation', dc.coords).then(function(response) {
      console.log('update location -- success', response);
    })
  } //end put req

  dc.userName = UserService.userObject.userName;
  dc.tripMessage = 'Arrive for ';

  dc.arrive = function() {
    console.log('DriverNotificationController');
    if(dc.tripMessage === 'Arrive for ') {
      console.log(dc.message);
      dc.tripMessage = 'Pick up ';
      //also send rider pickup dialog
    } else if (dc.tripMessage === 'Pick up '){
        dc.tripMessage = 'Drop off ';
        //also starts destination routing
      } else if (dc.tripMessage === 'Drop off '){
          //also calls rider fare dialog
        }
    };

  dc.acceptRide = function() {
    DataService.acceptRide();
  }

}); //end of controller
