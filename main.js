requirejs.config({
  paths: {
    "jquery": "scripts/libs/jquery-1.8.3",
    "underscore": "scripts/libs/underscore-amd",
    "parse": "scripts/libs/parse",
    "handlebars": "scripts/libs/handlebars",
    "backbone": "scripts/libs/backbone-amd",
    "handsontable": "scripts/libs/jquery.handsontable.full",
    "jQueryUI": "scripts/libs/jquery-ui-1.10.3.custom",
    "bootstrap": "scripts/libs/bootstrap/js/bootstrap"

  },
  shim: {
    "parse": {
      deps: ["jquery", "underscore"],
      exports: "Parse"
    },

    "handlebars": {
      exports: "Handlebars"
    },
    "jQueryUI": {
      export:"$",
      deps: ['jquery']
    },
    "handsontable": {
      export:"Handsontable"
    }
  }
});

require([

  // Load our app module and pass it to our definition function
  'app'
], function(App){
  // The "app" dependency is passed in as "App"
  App.initialize();

});



