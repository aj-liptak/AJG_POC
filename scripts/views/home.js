//Filename: home.js

define([
  // These are path alias that we configured in our bootstrap
  'jquery',
  'underscore',
  'parse',
  'text!templates/home.html',
  'scripts/collections/contacts',
  'handsontable',
  'scripts/models/client',
  'jQueryUI',
  'bootstrap'

], function($, _, Parse, HomeTemplate, ContactsCollection, Handsontable, ClientModel, jQueryUI, Bootstrap){
  var HomeView = Parse.View.extend({

    el: $('#container'),

    render: function(){
      // Using Underscore we can compile our template with data

      var data = {};
      var compiledTemplate = _.template( HomeTemplate, data );
      // Append our compiled template to this Views "el"
      //this.$el.append( compiledTemplate );
      this.$el.append(compiledTemplate);

      this.build();

    },

    events: {
      'click .dropdown-item': 'onDropdownItem'

    },

    onDropdownItem: function (e) {
      e.stopPropagation();
      var element = $(e.currentTarget).closest('.input-append').children()[0];
      $(element).val(e.currentTarget.textContent);
      $(e.currentTarget).dropdown('toggle');
    },

    build: function () {

      var contactsCollection = new ContactsCollection();
      var data = [
      ];

      var tableValues = [
        {"name": 'ADVANCED ENERGY TECHNOLOGIES', "code": '9832', "policy": '893641'}
      ];

      $('#orgUnit').typeahead({
        source: ['GBS']
      });

      $('#status').typeahead({
        source: ['Active', 'Delete']
      });

      $('#carrier').typeahead({
        source: ['Ameritas']
      });

      contactsCollection.add(tableValues);

      var shouldExecute = true;

      var receiptTotal = 0;
      var premiumTotal = 0;
      var unappliedAmount = 0;


      var settings = {
        data: data,
        dataSchema: makeClient,
        contextMenu: true,
        autoWrapRow: true,
        colHeaders: ["Client Name", "Client Code", "Policy #", "Client/Policy/etc..", "Period", "Premium Amount", "Receipt Amount", "Notes"],
        colWidths: [175, 100, 100, 185, 100, 125, 125, 125],
        columns: [
          {
            data: 'name',
            type: 'autocomplete',
            source: ["ADVANCED ENERGY TECHNOLOGIES", "BONDED CONCRETE", "BUSINESS COUNCIL OF NYS, INC.", "CAPITAL CITIES LEASING CORP.", "TABNER, RYAN, & KENIRY"], //empty string is a valid value
            strict: false
          },
          {data: "code"},
          {data: "policy"},
          {data: "clientInfo"},
          {
            data: "period"
          },
          {
            data: "premiumAmount",
            type: 'numeric',
            format: '$ 0,0.00'},
          {
            data: "receiptAmount",
            type: 'numeric',
            format: '$ 0,0.00'
          },
          {data: "notes"}
        ],
        afterChange: function(changes, source) {
          var instance = $container.handsontable('getInstance');

          if(changes && shouldExecute && changes[0][1] === 'name'){
            shouldExecute = false;
            var contactsCollection = new ContactsCollection();
            var tableValues = [
              {"name": 'ADVANCED ENERGY TECHNOLOGIES', "clientInfo": "ADVANCED ENERGY/AMERITAS/9382/893641", "code": '9832', "policy": '893641'},
              {"name": 'BONDED CONCRETE',  "clientInfo": "BONDED CONCRETE/AMERITAS/7432/8275626", "code": '7432', "policy": '8275626'},
              {"name": 'BUSINESS COUNCIL OF NYS, INC.',  "clientInfo": "BUSINESS COUNCIL/AMERITAS/1543/543821", "code": '1543', "policy": '543821'},
              {"name": 'CAPITAL CITIES LEASING CORP.',  "clientInfo": "CAPITAL CITIES/AMERITAS/4197/635187", "code": '4197', "policy": '635187'},
              {"name": 'TABNER, RYAN, & KENIRY',  "clientInfo": "TABNER, RYAN/AMERITAS/0742/2107363", "code": '0742', "policy": '2107363'}

            ];

            var key = changes[0][1];
            var obj = {};
            obj[key] = changes[0][3];

            var data = _.where(tableValues, obj);

            var results = data[0];
            //instance.setDataAtRowProp(0, 'name', results.name, this);
            instance.setDataAtRowProp(changes[0][0], 'code', results.code, this);
            instance.setDataAtRowProp(changes[0][0], 'policy', results.policy, this);
            instance.setDataAtRowProp(changes[0][0], 'clientInfo', results.clientInfo, this);
            shouldExecute = true;

          } else if(changes && changes[0][1] === 'receiptAmount'){
            receiptTotal = 0;
            var receiptColumn = instance.getDataAtCol(6);
            var receiptColumnFlat = _.compact(receiptColumn);
            for(var k=0; k < receiptColumnFlat.length; k++){
              receiptTotal += receiptColumnFlat[k];
            }
            $('#receiptTotal').val(receiptTotal);

            unappliedAmount = $('#checkAmount').val() - receiptTotal;

            if(unappliedAmount === 0){
              $('#unappliedAmount').addClass("correctAmount");
            } else {
              $('#unappliedAmount').removeClass("correctAmount");
            }

            $('#unappliedAmount').val(unappliedAmount);
          }
          else if(changes && changes[0][1] === 'premiumAmount'){
            premiumTotal = 0;
            var premiumColumn = instance.getDataAtCol(5);
            var premiumColumnFlat = _.compact(premiumColumn);
            for(var k=0; k < premiumColumnFlat.length; k++){
              premiumTotal += premiumColumnFlat[k];
            }
            $('#premiumTotal').val(premiumTotal);
          }
        },
        cells: function (row, col, prop) {
          var cellProperties = {};
          if (row === 0) {
            cellProperties.renderer = firstRowRenderer; //uses function directly
          }
        },
        minSpareRows: 1 //see notes on the left for `minSpareRows`
      }

      var $container = $("#grid");
      $container.handsontable(settings);

      this.settings = settings;
      function firstRowRenderer(instance, td, row, col, prop, value, cellProperties) {
        var data = td;
        data.style.background = '#666';
        window.Handsontable.TextCell.renderer.apply(this, instance, data, row, col, prop, value, cellProperties);
      }


      // you'll have to make something like these until there is a better
  // way to use the string notation, i.e. "bb:make"!

      // normally, you'd get these from the server with .fetch()
      function attr(attr) {
        // this lets us remember `attr` for when when it is get/set
        return {data: function (car, value) {
          if (_.isUndefined(value)) {
            return car.get(attr);
          }
          car.set(attr, value);
        }};
      }


// just setting `dataSchema: CarModel` would be great, but it is non-
// trivial to detect constructors...
      function makeClient() {
        return new ClientModel();
      }

// show a log of events getting fired
      function log_events(event, model) {
        var now = new Date();
        $("#example1_events").prepend(
            $("<option/>").text([
              ":", now.getSeconds(), ":", now.getMilliseconds(),
              "[" + event + "]",
              JSON.stringify(model)
            ].join(" "))
          )
          .scrollTop(0);
      }
    }

  });

  return HomeView;

});