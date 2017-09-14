var session = require('express-session');

module.exports = session({
   secret: process.env.SECRET_VARIABLE || 'debug',
   key: 'user', // this is the name of the req.variable. 'user' is convention, but not required
   resave: 'true',
   saveUninitialized: false,
   cookie: { maxage: 60000, secure: false }
});
