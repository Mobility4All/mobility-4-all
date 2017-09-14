var session = require('express-session');

module.exports = session({
   secret: process.env.SECRET_VARIABLE || 'debug',
   key: 'user',
   resave: 'true',
   saveUninitialized: false,
   cookie: { maxage: 60000, secure: false }
});
