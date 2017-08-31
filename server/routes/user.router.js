var express = require('express');
var router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', function(req, res) {
  console.log('get /user route');
  // check if logged in
  if(req.isAuthenticated()) {
    // send back user object from database
    // console.log('logged in', req.user);
    var userInfo = {};
    if(req.user.hasOwnProperty('rider_first')) {
      userInfo.id = req.user.id
      userInfo.userName = req.user.username;
      userInfo.rider_first = req.user.rider_first;
      userInfo.rider_last = req.user.rider_last;
      userInfo.rider_photo_url = req.user.rider_photo_url;
      userInfo.rider_cell = req.user.rider_cell;
      userInfo.rider_email = req.user.rider_email;
      userInfo.complete = req.user.complete;
      userInfo.rider_addtl_info = req.user.rider_addtl_info;
      userInfo.cg_first = req.user.cg_first;
      userInfo.cg_cell = req.user.cg_cell;
      userInfo.cg_email = req.user.cg_email;
      userInfo.elec_wheelchair = req.user.elec_wheelchair;
      userInfo.col_wheelchair = req.user.col_wheelchair;
      userInfo.service_animal = req.user.service_animal;
      userInfo.oxygen = req.user.oxygen;
    } else {
      userInfo.id = req.user.id
      userInfo.userName = req.user.username;
      userInfo.first_name = req.user.first_name;
      userInfo.last_name = req.user.last_name;
      userInfo.phone = req.user.phone;
      userInfo.elec_wheelchair = req.user.elec_wheelchair;
      userInfo.col_wheelchair = req.user.col_wheelchair;
      userInfo.service_animal = req.user.service_animal;
      userInfo.oxygen = req.user.oxygen;
      userInfo.complete = req.user.complete;
    }
    res.send(userInfo);
  } else {
    // failure best handled on the server. do redirect here.
    console.log('not logged in');
    // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
    res.send(false);
  }
});

// clear all server session information about this user
router.get('/logout', function(req, res) {
  // Use passport's built-in method to log out the user
  console.log('Logged out');
  req.logOut();
  res.sendStatus(200);
});


module.exports = router;
