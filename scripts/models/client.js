//Client Model
define([
  // These are path alias that we configured in our bootstrap
  'jquery',
  'underscore',
  'parse'
], function($, _, Parse){
  var ClientModel = Parse.Object.extend({
    className: 'Client'
  });
  return ClientModel
  // What we return here will be used by other modules
});
