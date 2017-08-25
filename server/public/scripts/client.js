var myApp = angular.module('myApp', ['ngRoute', 'ngMaterial', 'ngMap']);

/// Routes ///
myApp.config(function($routeProvider, $locationProvider, $mdThemingProvider) {
  $locationProvider.hashPrefix('');
  console.log('myApp -- config')
  $routeProvider
  .when('/home', {
    templateUrl: '/views/templates/home.html',
    controller: 'LoginController as lc',
  })
  .when('/register', {
    templateUrl: '/views/templates/register.html',
    controller: 'LoginController as lc'
  })
  .when('/user', {
    templateUrl: '/views/templates/user.html',
    controller: 'UserController as uc',
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

  $mdThemingProvider.theme('default')
    .primaryPalette('mobilityPalette')
});
