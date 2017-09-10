myApp.controller('RiderProfileController', function($http, $mdDialog, $location, $window, $animate, $anchorScroll, $timeout) {
    console.log('RiderProfileController created');
    var rc = this;

    rc.selectedTab = 0;

    rc.switchTab = function(direction) {
      if(direction === 'back') {
        if(rc.selectedTab > 0) {
          rc.selectedTab--;
          $timeout(function(){
            $anchorScroll();
          }, 50);

          console.log('current tab', rc.selectedTab);
          // $window.scrollTo(0, 0);
        }
      }
      if(direction === 'next') {
        if(rc.selectedTab <= 2) {
          rc.selectedTab++;
          $timeout(function(){
            $anchorScroll();
          }, 50);
          //$anchorScroll();
          console.log('current tab', rc.selectedTab);
          // $window.scrollTo(0, 0);
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


    // Updates rider profile after setup
    rc.updateUser = function() {
      console.log(rc.user);
      $http.put('/rider/update', rc.user).then(function(response) {
        console.log('updated rider', response);
        rc.showAlert();
        $location.path('/on-demand')
      }).catch(function(response) {
        console.log('update rider error', response);
      })
    }

    // Photo upload functionality
    // API key
    rc.client = filestack.init('AX0Uil0hBT3afjt9bxjXXz');
    // Feedback for file upload
    rc.photoMessage = 'Photo is optional and will be displayed to drivers'
    // Upload image and put file url
    rc.pickPic = function() {
      console.log('adding rider pic');
      rc.client.pick({
        accept: 'image/*',
        maxFiles:1
      }).then(function (result) {
        console.log('json result', JSON.stringify(result));
        console.log('url:', result.filesUploaded[0].url);
        var imgUrl = {
          rider_photo_url: result.filesUploaded[0].url
        }
        $http.put('/rider/photo', imgUrl).then(function(response) {
          console.log('added picture', response);
          rc.photoMessage = 'Photo added successfully';
        }).catch(function(response) {
          console.log('add picture error', response);
          rc.photoMessage = 'Error uploading photo';
        })
      });
    }
});
