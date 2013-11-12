define([
  'jquery',
  'underscore',
  'parse',
  'scripts/router' // Request router.js
], function($, _, Parse, Router){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function
    Parse.initialize("x8Gw7rBpQkubRrCdOOeOzur16kJTWG58meBnGOaM", "ROeL7LIcJC6WbpAZ1EabzTMLkXbLz5yP3emOj14t");
    Router.initialize();
  }

  return {
    initialize: initialize
  };
});
