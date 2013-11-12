// Filename: router.js
define([
  'jquery',
  'underscore',
  'parse',
  'scripts/views/home',

], function($, _, Parse, HomeView) {
  var AppRouter = Parse.Router.extend({
    routes: {
      // Define some URL routes
      'home': 'showHome'
    },

    showHome: function() {
      // Call render on the module we loaded in via the dependency array
      var homeView = new HomeView();
      homeView.render();
    }

  });

  var initialize = function(){
    var app_router = new AppRouter();
    Parse.history.start({pushState: true});
    Parse.history.navigate('home', true);
  };

  return {
    initialize: initialize
  };
});
