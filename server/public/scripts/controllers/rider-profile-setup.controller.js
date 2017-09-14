myApp.controller('RiderProfileController', function($http, $mdDialog, $location, $anchorScroll, $timeout) {
  console.log('RiderProfileController created');
  var rc = this;

  rc.selectedTab = 0;

  //controls the angular material three step sign up form
  rc.switchTab = function(direction) {
    if(direction === 'back') {
      if(rc.selectedTab > 0) {
        rc.selectedTab--;
        $timeout(function(){
          $anchorScroll();
        }, 50);
      }
    }
    if(direction === 'next') {
      if(rc.selectedTab <= 2) {
        rc.selectedTab++;
        $timeout(function(){
          $anchorScroll();
        }, 50);
      }
    }
  }

  // Set default checkbox behavior
  rc.caregiver = false;
  // Intiialize empty user object
  rc.user = {};

  // List of states abbreviations for dropdown select
  rc.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
  'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
  'WY').split(' ').map(function (state) { return { abbrev: state }; }
);

//show success dialog box when a user completes their profile
rc.showAlert = function(ev) {
  $mdDialog.show(
    $mdDialog.alert()
    .parent(angular.element(document.querySelector('#popupContainer')))
    .clickOutsideToClose(true)
    .title('Profile Complete!')
    .textContent('Your profile has been completed. We can now match you with drivers.')
    .ariaLabel('Rider Registration Confirmation')
    .ok('Got it!')
    .targetEvent(ev)
  );
};


// Updates rider profile in DB when they submit profile form
rc.updateUser = function() {
  $http.put('/rider/update', rc.user).then(function(response) {
    rc.showAlert();
    $location.path('/on-demand')
  }).catch(function(response) {
  })
}

// Photo upload functionality
// API key
rc.client = filestack.init('AX0Uil0hBT3afjt9bxjXXz');
// Feedback for file upload
rc.photoMessage = 'Photo is optional and will be displayed to drivers'
// Upload image and put file url
rc.pickPic = function() {
  rc.client.pick({
    accept: 'image/*',
    maxFiles:1
  }).then(function (result) {
    var imgUrl = {
      rider_photo_url: result.filesUploaded[0].url
    }
    $http.put('/rider/photo', imgUrl).then(function(response) {
      rc.photoMessage = 'Photo added successfully';
    }).catch(function(response) {
      rc.photoMessage = 'Error uploading photo';
    })
  });
}
});
