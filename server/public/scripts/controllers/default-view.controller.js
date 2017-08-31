myApp.controller('DefaultViewController', function($http, $timeout, $mdBottomSheet, $mdToast, DataService, $scope, $interval) {

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

  //clear and reset the text directions after each new directions request
  dc.panelEl = angular.element( document.querySelector( '#right-panel' ) );

//on click, old req is cleared, new request is called with initMap() to get and show new directions
  dc.onClick = function() {
    dc.panelEl.empty();
    initMap();
    geocodeLatLng(geocoder, infowindow);  //REMOVED map param
    console.log(dc.start);
    console.log(dc.end);
  };

//this google maps function gets directions and displays on a map and with text
  function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 7,  // this resets after directions are received. Might update if we want to change initial view.
      center: {lat: 41.85, lng: -87.65} //Might update if we want to change initial view.
    });
    directionsDisplay.setMap(map);
    //setPanel displays the written driving directions
    directionsDisplay.setPanel(document.getElementById('right-panel'));
    calculateAndDisplayRoute(directionsService, directionsDisplay);
    //calculateAndDisplayRoute shows map and line drawing of route


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
          console.log('Directions request failed due to ' + status);
        }
      });
    }
  } //end of google map direction function


  //HTML 5 geolocation code begins here
  dc.message = '';
  dc.coords = {
    lat: '',
    lng: ''
  };

// geoLocate called on click. getLocation checks for browser compatability (user must approve to enable),
//then getLocation calls showPosition(), which gets coords. Then showPosition() calls updateDriverLocation()
//to make a put request to database with the driver location.
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

//hide/show accept a rider
dc.showGridBottomSheet = function() {
  dc.alert = '';
  $mdBottomSheet.show({
    templateUrl: 'views/partials/driver-ride-notification.html',
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

  function updateDriverLocation() {
    $http.put('/driver/geolocation', dc.coords).then(function(response) {
      console.log('update location -- success', response);
    })
  } //end put req


//REVERSE GEOCODE CODE
  // create new GeoCoder
    var geocoder = new google.maps.Geocoder;
    var infowindow = new google.maps.InfoWindow;

//i removed the maps param from the function below
    function geocodeLatLng(geocoder, infowindow) {


        var input = '44.9780310,-93.2635010';
        // can test with other input, it works: 40.714224,-73.961452

        var latlngStr = input.split(',', 2);
        var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
        geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === 'OK') {
            if (results[0]) {
              infowindow.setContent(results[0].formatted_address);
              // infowindow.open(map, marker);
              console.log('hopefully this is primes address', results[0].formatted_address);
            } else {
              console.log('No results found');
            }
          } else {
            console.log('Geocoder failed due to: ' + status);
          }
        });
      }

}); //end of controller
