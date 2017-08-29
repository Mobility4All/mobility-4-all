myApp.controller('RidePurposeController', function(DataService, $location, $http) {
    console.log('RidePurposeController created');
    var rc = this;
    rc.ride = {};
    rc.message = '';

    geolocate();

    var placeSearch, autocomplete, autocomplete2, destA, destB, latA, lngA, latB, lngB;
    // var componentForm = {
    //   street_number: 'short_name',
    //   route: 'long_name',
    //   locality: 'long_name',
    //   administrative_area_level_1: 'short_name',
    //   country: 'long_name',
    //   postal_code: 'short_name'
    // };

    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
      {types: ['geocode']});

    // second location
    autocomplete2 = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete2')),
      {types: ['geocode']});

      function fillInAddress() {
        var geocoder = new google.maps.Geocoder();
        destA = autocomplete.getPlace();
        destB = autocomplete2.getPlace();

        rc.ride.latA = destA.geometry.location.lat();
        rc.ride.lngA = destA.geometry.location.lng();
        rc.ride.latB = destB.geometry.location.lat();
        rc.ride.lngB = destB.geometry.location.lng();
      }




    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
    rc.addressA = destA;

    autocomplete2.addListener('place_changed', fillInAddress);
    rc.addressB = destB;


    // Bias the autocomplete object to the user's geographical location,
    // as supplied by the browser's 'navigator.geolocation' object.
    function geolocate() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          console.log(position);
          var geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          var circle = new google.maps.Circle({
            center: geolocation,
            radius: position.coords.accuracy
          });
          autocomplete.setBounds(circle.getBounds());
        });
      }
    }

    rc.putDestAB = function() {
      console.log("destA lat/lan are:", rc.ride.latA, rc.ride.lngA);
      console.log("destB lat/lng are:", rc.ride.latB, rc.ride.lngB);
      $http.post('/rider/destAB', rc.ride).then(function(response) {
        console.log('destAB put to db', response);
      }).catch(function(response) {
        console.log('destAB put error', response);
      });
    };

    rc.updatePurpose = function(purpose) {
      rc.ride.purpose = purpose;
      console.log('ride purpose', rc.ride.purpose);
    };

    rc.confirmPurpose = function() {
      console.log('confirming purpose');
      if (rc.ride.purpose) {
        DataService.rideObject.purpose = rc.ride.purpose;
        console.log('data ride:', DataService.rideObject.purpose);
        $location.path('/input-ride')
      } else {
        rc.message = 'Please select a purpose'
      }
    }
});
