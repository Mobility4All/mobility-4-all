var twilioKeys = require('./twiliokeys.config');
var cfg = {};

// Twilio Keys
cfg.accountSid = process.env.TWILIO_ACCOUNT_SID || twilioKeys.TWILIO_ACCOUNT_SID;
cfg.authToken = process.env.TWILIO_AUTH_TOKEN || twilioKeys.TWILIO_AUTH_TOKEN;
cfg.sendingNumber = process.env.TWILIO_NUMBER || twilioKeys.TWILIO_NUMBER;

// Assigns keys to an array and checks to see that each is true
var requiredConfig = [cfg.accountSid, cfg.authToken, cfg.sendingNumber];
var isConfigured = requiredConfig.every(function(configValue) {
  return configValue || false;
});

// If all key values are not true, sends an error message
if (!isConfigured) {
  var errorMessage =
    'TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_NUMBER must be set.';
  throw new Error(errorMessage);
}

// Export configuration object
module.exports = cfg;
