myApp.factory('UserService', function($http, $location, $mdSidenav){
  console.log('UserService Loaded');

  var userObject = {};

  function buildToggler(componentId) {
    return function() {
      $mdSidenav(componentId).toggle();
    
    };

  }


  return {
    userObject : userObject,
    // socket: socket,

    getuser : function(){
      console.log('UserService -- getuser');
      $http.get('/user').then(function(response) {
          if(response.data.userName) {
              // user has a curret session on the server
              for(key in response.data) {
                userObject[key] = response.data[key]
              }
              // userObject.userName = response.data.userName;
              // userObject.complete = response.data.complete;
              console.log('UserService -- getuser -- User Data: ', userObject);
          } else {
              console.log('UserService -- getuser -- failure');
              // user has no session, bounce them back to the login page
              $location.path("/home");
          }
      },function(response){
        console.log('UserService -- getuser -- failure: ', response);
        $location.path("/home");
      });
    },
    toggleLeft : buildToggler('left'),
    toggleRight : buildToggler('right'),

    logout : function() {
      console.log('UserService -- logout');
      $http.get('/user/logout').then(function(response) {
        console.log('UserService -- logout -- logged out');
        $location.path("/home");
      });
    }
  };
});
