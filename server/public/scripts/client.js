var myApp = angular.module('myApp', ['ngRoute', 'ngMaterial', 'ngMap']);

/// Routes ///
myApp.config(function($routeProvider, $locationProvider, $mdThemingProvider) {
  $locationProvider.hashPrefix('');
  console.log('myApp -- config');
  $routeProvider
    .when('/home', {
      templateUrl: '/views/templates/home.html',
      controller: 'HomeController as hc',
    })
    .when('/user', {
      templateUrl: '/views/templates/user.html',
      controller: 'HomeController as hc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/info', {
      templateUrl: '/views/templates/info.html',
      controller: 'InfoController',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/register', {
      templateUrl: '/views/templates/register.html',
      controller: 'RiderLoginController as rc',

    })
    .when('/ride-purpose', {
      templateUrl: '/views/templates/rider/ride-purpose.html',
      controller: 'RidePurposeController as rc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/send-ride', {
      templateUrl: '/views/templates/rider/send-ride.html',
      controller: 'SendRideController as sc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/ride-arrival', {
      templateUrl: '/views/templates/rider/ride-arrival.html',
      controller: 'RideArrivalController as rc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/arrival', {
      templateUrl: '/views/templates/rider/arrival.html',
      controller: 'ArrivalController as rc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/driver-login', {
      templateUrl: '/views/templates/driver/driver-login.html',
      controller: 'DriverLoginController as dc'
    })
    .when('/rider-login', {
      templateUrl: '/views/templates/rider/rider-login.html',
      controller: 'RiderLoginController as rc'
    })
    .when('/rider-profile-setup', {
      templateUrl: '/views/templates/rider/rider-profile-setup.html',
      controller: 'RiderProfileController as rc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/driver-profile-setup', {
      templateUrl: '/views/templates/driver/driver-profile-setup.html',
      controller: 'DriverProfileController as dc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/on-demand', {
      templateUrl: '/views/templates/rider/on-demand.html',
      controller: 'OnDemandController as oc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/default-view', {
      templateUrl: '/views/templates/driver/default-view.html',
      controller: 'DefaultViewController as dc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/ride-notification', {
      templateUrl: '/views/templates/rider/ride-notification.html',
      controller: 'RideNotificationController as rc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/pickup-view', {
      templateUrl: '/views/templates/rider/pickup-view.html',
      controller: 'PickupViewController as pc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/ride-complete', {
      templateUrl: '/views/templates/rider/ride-complete.html',
      controller: 'RideCompleteController as rc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .otherwise({
      redirectTo: 'home'
    });


  // AngularJS Material palette/theme settings
  $mdThemingProvider.definePalette('mobilityPalette', {
    '50': 'f1f8eb',
    '100': 'dceecd',
    '200': 'c4e2ab',
    '300': 'acd689',
    '400': '9bce70',
    '500': '89c557',
    '600': '81bf4f',
    '700': '76b846',
    '800': '6cb03c',
    '900': '59a32c',
    'A100': 'efffe6',
    'A200': 'ceffb3',
    'A400': 'aeff80',
    'A700': '9dff67',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': [
      '50',
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      'A100',
      'A200',
      'A400',
      'A700'
    ],
    'contrastLightColors': [
      '900'
    ]
  });

  $mdThemingProvider.definePalette('logoutPalette', {
    '50': 'FFEDF1',
    '100': 'FFD2DC',
    '200': 'FFB5C4',
    '300': 'FF97AC',
    '400': 'FF809B',
    '500': 'FF6A89',
    '600': 'FF6281',
    '700': 'FF5776',
    '800': 'FF4D6C',
    '900': 'FF3C59',
    'A100': 'FFFFFF',
    'A200': 'FFFFFF',
    'A400': 'FFE5E8',
    'A700': 'FFCBD2',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': [
      '50',
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      'A100',
      'A200',
      'A400',
      'A700'
    ],
    'contrastLightColors': [
      '900'
    ]
  });

  $mdThemingProvider.theme('default')
    .primaryPalette('mobilityPalette')
    .warnPalette('logoutPalette');

});
