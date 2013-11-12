define([
  // These are path alias that we configured in our bootstrap
  'jquery',
  'underscore',
  'backbone',
  'scripts/models/client'
], function($, _, Backbone, ClientModel){
  var ClientsCollection = Backbone.Collection.extend({
    model: ClientModel,

    splice: function (index, howMany /* model1, ... modelN */) {
      var args = _.toArray(arguments).slice(2).concat({at: index}),
        removed = this.models.slice(index, index + howMany);
      this.remove(removed).add.apply(this, args);
      return removed;
    }
  });

  return ClientsCollection;
  // What we return here will be used by other modules
});