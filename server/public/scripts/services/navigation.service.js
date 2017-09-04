myApp.factory('NavigationService', function($http, $location, $mdSidenav, UserService, DataService, $interval){
  console.log('NavigationService Loaded');

  // Ride object that is sent with ride request
  var rideObject = {
    rider: UserService.userObject
  };
  //google maps start and end destinations
  var startAndEnd = {
    start: '',
    end: ''
  }
  //the set panel directions
  //clear and reset the text directions after each new directions request
  var panelEl = angular.element( document.querySelector( '#right-panel' ) );
  //message and coords for Geolocation
  var message = '';
  var coords = {
    lat: '',
    lng: ''
  };

  // var driverOffline = true;

  // //toggle function to show driver online and golive
  // function toggleOnline() {
  //   if(driverOffline) {
  //     $http.put('/driver/live/');
  //     DataService.connectDriver();
  //   }
  //   if(!driverOffline) {
  //     $http.put('/driver/unlive/');
  //     DataService.disconnectDriver();
  //   }
  //   driverOffline = !driverOffline;
  //   console.log(driverOffline);
  // };

  // create new GeoCoder to reverser geolocation
  var geocoder = new google.maps.Geocoder;
  var infowindow = new google.maps.InfoWindow;


  // makes req to update driver location in DB
  function updateDriverLocation() {
    $http.put('/driver/geolocation', coords).then(function(response) {
      console.log('update location -- success', response);
    })
  } //end put req





  function acceptRide() {
    DataService.acceptRide();
    // dc.buttonVisible = true;
    DataService.buttonShow = !DataService.buttonShow;
    console.log('who\'s the rider?', DataService.rideObject);
    geoLocate();
    startAndEnd.start = coords.lat + coords.lng;
    startAndEnd.end = "DataService.rideObject.rider.coord.latA" + "DataService.rideObject.rider.coord.lngA";
    setTimeout(initMap, 10000);
    //  initMap();
  };


  // //what is this connected to??
  // dc.toggleShow = function() {
  //   DataService.buttonShow = !DataService.buttonShow;
  // }



  // These functions take in user input for start and end destinations, and returns
  //a google map with polyline route and with text driving directions
  //on click, old req is cleared, new request is called with initMap() to get and show new directions
  function startNavigation() {
    panelEl.empty();
    initMap();
    geocodeLatLng(geocoder, infowindow);  //REMOVED map param (this does reverse geocode)
    console.log('start', startAndEnd.start);
    console.log('end', startAndEnd.end);
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
        origin: startAndEnd.start, //have changed from original
        destination: startAndEnd.end, //have changed from origi
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
  // geoLocate called on click. getLocation checks for browser compatability (user must approve to enable),
  //then getLocation calls showPosition(), which gets coords. Then showPosition() calls updateDriverLocation()
  //to make a put request to database with the driver location.
  geoLocate = function() {
    console.log('update location function called');

    getLocation();

    function showPosition(position) {
      message = "Latitude:  " + position.coords.latitude + "  Longitude: " + position.coords.longitude + "";
      // $scope.$apply();
      console.log('position coords', position.coords);
      coords.lat = position.coords.latitude;
      coords.lng = position.coords.longitude;
      console.log('dc.coords', coords);
      updateDriverLocation();
    } // end show position function

    function getLocation () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        message = "Geolocation is not supported by this browser.";
      }
    } //end of getLocation fn
  }; //end geolocat
  //end of html5 geo


  callInterval = function() {
    //Show current seconds value 5 times after every 1000 ms
    $interval(geoLocate, 60000);
  };


  //REVERSE GEOCODE CODE
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



  //EVERYTHING BELOW THIS LINE SHOULD BE RETURNED
    return {
      rideObject: rideObject,
      startNavigation: startNavigation,
      callInterval: callInterval,
      geoLocate: geoLocate,
      acceptRide: acceptRide
      // driverOffline: driverOffline,
      // toggleOnline: toggleOnline
    };

}); //end of nav service.
