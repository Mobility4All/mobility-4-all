myApp.factory('NavigationService', function($http, $rootScope, UserService, DataService, $interval){
  console.log('NavigationService Loaded');

  // Ride object that is sent with ride request
  //this includes the rider's requested start and end points
  var rideObject = {
    rider: UserService.userObject
  };



  //GOOGLE MAPS start and end destinations for google map navigations
  var tripStartAndEnd = {
    start: '',
    end: ''
  }


  //Object to store driver coordination, used in Geolocation functions
  var coords = {
    lat: '',
    lng: ''
  };

  //the coordinates and object used in reverse Geolocation function
  //takes latitute and longitude and returns a human readable address
  var reverseGeoInput = '';
  var toAddress = {
    address: ' '
  };


  // create new GeoCoder to reverse geolocation
  var geocoder = new google.maps.Geocoder;
  var infowindow = new google.maps.InfoWindow;

  //declaring global refresh variable for interval
  var refreshLocation;


  //this function is called when the driver selects to accept a ride.
  //After 1 second, calls initMap() to provide a visual map and written turn by turn direcions
  //the map function will take in the drivers current location (coords.lat and coords.lng),
  //and the rider's requested pickup coordinates
  //Buttonshow is toggled to display to the driver that they are online and have accepted a ride
  //geocodeLatLng is called to reverse geolocate and return a human readable address, displayed to the driver
  //(button on driver-ride-notifcation.html calls this function)
  function acceptRide() {
    DataService.acceptRide();
    stopUpdateLocationInterval();
    DataService.buttonShow = !DataService.buttonShow;
    var riderPickupLat = DataService.rideObject.rider.coord.latA;
    var riderPickupLng = DataService.rideObject.rider.coord.lngA;
    tripStartAndEnd.start = coords.lat + " " + coords.lng;
    tripStartAndEnd.end = riderPickupLat + " " + riderPickupLng;
    setTimeout(initMap, 1000);
    reverseGeoInput = riderPickupLat + "," + riderPickupLng;
    reverseGeocodeLatLng(geocoder, infowindow);
  };




  //Calls initMap with new start and destination coords, to create map
  // with polyline route and with text driving directions
  //panelEl.empty() removes old written direction in order to replace them with the updated route
  //geocodeLatLng is called again to provide the human readable address for the route destination
  //this function is called the driver-notification-controller.js
  function startDestNavigation() {
    var riderPickupLat = DataService.rideObject.rider.coord.latA;
    var riderPickupLng = DataService.rideObject.rider.coord.lngA;
    var riderDestLat = DataService.rideObject.rider.coord.latB;
    var riderDestLng = DataService.rideObject.rider.coord.lngB;
    var panelEl = angular.element(document.getElementById('right-panel'));
    panelEl.empty();
    toAddress.address = " ";
    reverseGeoInput = riderDestLat + "," +  riderDestLng;
    reverseGeocodeLatLng(geocoder, infowindow);
    tripStartAndEnd.start = riderPickupLat + " " +  riderPickupLng;
    tripStartAndEnd.end = riderDestLat + " " +  riderDestLng;
    setTimeout(initMap, 1000);
  };

  //this google maps function gets directions and displays on an div element with id = map
  // populates a sidenav (div with an id of "right-panel") with text directions
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
    //calculateAndDisplayRoute shows map and line drawing of route


    function calculateAndDisplayRoute(directionsService, directionsDisplay) {
      directionsService.route({
        origin: tripStartAndEnd.start,
        destination: tripStartAndEnd.end,
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



  // when driver is online, use HTML5 geolocation to update their location every 60 seconds
  //geolocate finds the coordinates of the user, and then makes a request to update the DB with most recent location
  var updateLocationInterval = function() {
    geoLocate();
    refreshLocation = $interval(geoLocate, 60000);
  };

  //when driver accepts a ride, stop updating location
  var stopUpdateLocationInterval = function() {
    $interval.cancel(refreshLocation);
  }

  //HTML 5 geolocation captures the current location coordinates of user
  // geoLocate called on click. getLocation checks for browser compatability (user must approve to enable),
  //then getLocation calls showPosition(), which gets coords. Then showPosition() calls updateDriverLocation()
  //to make a put request to database with the driver location.
  function geoLocate() {
    getLocation();
    function getLocation () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        message = "Geolocation is not supported by this browser.";
      }
    } //end of getLocation fn

    function showPosition(position) {
      coords.lat = position.coords.latitude;
      coords.lng = position.coords.longitude;
      updateDriverLocation();
    } // end show position function
  }; //end geolocat
  //end of html5 geo

  // makes req to update driver location in DB
  //called above, in geoLocate function
  function updateDriverLocation() {
    $http.put('/driver/geolocation', coords).then(function(response) {
      console.log('update location -- success', response);
    })
  } //end put req



  //REVERSE GEOCODE function takes in coordinates and returns a human readable address
  function reverseGeocodeLatLng(geocoder, infowindow) {
    var latlngStr = reverseGeoInput.split(',', 2);
    var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
    geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          $rootScope.$apply(function(){
            toAddress.address = results[0].formatted_address;
          });
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    });
  }



  return {
    rideObject: rideObject,
    startDestNavigation: startDestNavigation,
    updateLocationInterval: updateLocationInterval,
    geoLocate: geoLocate,
    acceptRide: acceptRide,
    reverseGeocodeLatLng: reverseGeocodeLatLng,
    toAddress: toAddress
  };

}); //end of nav service.
