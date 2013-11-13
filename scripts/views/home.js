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
  var tableValues = [
    {"name": 'ADVANCED ENERGY TECHNOLOGIES', "clientInfo": "ADVANCED ENERGY/ AMERITAS/9382/893641", "code": '9832', "policy": '893641'},
    {"name": 'ADVANCED ENERGY TECHNOLOGIES', "clientInfo": "ADVANCED ENERGY/ AMERITAS/97342/899732", "code": '97342', "policy": '899732'},
    {"name": 'ADVANCED ENERGY TECHNOLOGIES', "clientInfo": "ADVANCED ENERGY/ AMERITAS/23179/128462", "code": '23179', "policy": '128462'},
    {"name": 'ADVANCED ENERGY TECHNOLOGIES', "clientInfo": "ADVANCED ENERGY/ AMERITAS/19734/765321", "code": '19734', "policy": '765321'},
    {"name": 'ADVANCED ENERGY TECHNOLOGIES', "clientInfo": "ADVANCED ENERGY/ AMERITAS/93721/267523", "code": '93721', "policy": '267523'},
    {"name": 'BONDED CONCRETE',  "clientInfo": "BONDED CONCRETE/ AMERITAS/2975/108563", "code": '2975', "policy": '108563'},
    {"name": 'BONDED CONCRETE',  "clientInfo": "BONDED CONCRETE/ AMERITAS/9015/715021", "code": '9015', "policy": '715021'},
    {"name": 'BONDED CONCRETE',  "clientInfo": "BONDED CONCRETE/ AMERITAS/58432/297510", "code": '58432', "policy": '297510'},
    {"name": 'BONDED CONCRETE',  "clientInfo": "BONDED CONCRETE/ AMERITAS/12792/8275626", "code": '12792', "policy": '8275626'},
    {"name": 'BUSINESS COUNCIL OF NYS, INC.',  "clientInfo": "BUSINESS COUNCIL/ AMERITAS/71285/97212", "code": '71285', "policy": '97212'},
    {"name": 'BUSINESS COUNCIL OF NYS, INC.',  "clientInfo": "BUSINESS COUNCIL/ AMERITAS/27592/024122", "code": '27592', "policy": '024122'},
    {"name": 'BUSINESS COUNCIL OF NYS, INC.',  "clientInfo": "BUSINESS COUNCIL/ AMERITAS/1543/543821", "code": '1543', "policy": '543821'},
    {"name": 'CAPITAL CITIES LEASING CORP.',  "clientInfo": "CAPITAL CITIES/ AMERITAS/68261/397621", "code": '68261', "policy": '397621'},
    {"name": 'CAPITAL CITIES LEASING CORP.',  "clientInfo": "CAPITAL CITIES/ AMERITAS/497321/863423", "code": '497321', "policy": '863423'},
    {"name": 'CAPITAL CITIES LEASING CORP.',  "clientInfo": "CAPITAL CITIES/ AMERITAS/4197/635187", "code": '4197', "policy": '635187'},
    {"name": 'TABNER, RYAN, & KENIRY',  "clientInfo": "TABNER, RYAN/ AMERITAS/0742/2107363", "code": '0742', "policy": '2107363'},
    {"name": 'TABNER, RYAN, & KENIRY',  "clientInfo": "TABNER, RYAN/ AMERITAS/65540/91241", "code": '65540', "policy": '91241'},
    {"name": 'TABNER, RYAN, & KENIRY',  "clientInfo": "TABNER, RYAN/ AMERITAS/237412/094745", "code": '237412', "policy": '094745'}
  ];

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
      'click .dropdown-item': 'onDropdownItem',
      'change #carrier': 'onPayerChange',
      'change #checkAmount': 'onCheckAmount'
    },

    onPayerChange: function (e) {
      e.stopPropagation();
      $('#payer').val($('#carrier').val());
    },

    onCheckAmount: function (e) {
      e.stopPropagation();
      $('#unappliedAmount').val($('#checkAmount').val());
    },

    onDropdownItem: function (e) {
      e.stopPropagation();
      var element = $(e.currentTarget).closest('.input-append').children()[0];
      $(element).val(e.currentTarget.textContent);
      $(e.currentTarget).dropdown('toggle');

      if(element.id === 'carrier'){
        $('#payer').val($(element).val());
        var settings = $('#grid').handsontable('getInstance').getSettings();
        settings.columns[0].source = ["ADVANCED ENERGY TECHNOLOGIES", "BONDED CONCRETE", "BUSINESS COUNCIL OF NYS, INC.", "CAPITAL CITIES LEASING CORP.", "TABNER, RYAN, & KENIRY"];
        settings.columns[3].source = ["ADVANCED ENERGY/ AMERITAS/9382/893641", "ADVANCED ENERGY/ AMERITAS/97342/899732", "ADVANCED ENERGY/ AMERITAS/23179/128462", "ADVANCED ENERGY/ AMERITAS/19734/765321", "ADVANCED ENERGY/ AMERITAS/93721/267523", "BONDED CONCRETE/ AMERITAS/2975/108563", "BONDED CONCRETE/ AMERITAS/9015/715021", "BONDED CONCRETE/ AMERITAS/58432/297510", "BONDED CONCRETE/ AMERITAS/12792/8275626", "BUSINESS COUNCIL/ AMERITAS/71285/97212", "BUSINESS COUNCIL/ AMERITAS/27592/024122", "BUSINESS COUNCIL/ AMERITAS/1543/543821", "CAPITAL CITIES/ AMERITAS/68261/397621", "CAPITAL CITIES/ AMERITAS/497321/863423", "CAPITAL CITIES/ AMERITAS/4197/635187", "TABNER, RYAN/ AMERITAS/0742/2107363", "TABNER, RYAN/ AMERITAS/65540/91241", "TABNER, RYAN/ AMERITAS/237412/094745"];
        $('#grid').handsontable('getInstance').updateSettings(settings);
      } else if (element.id === 'checkAmountInput') {
        $('#checkAmountButton').text(e.currentTarget.textContent);
      }
    },

    build: function () {

      var date = new Date();

      var contactsCollection = new ContactsCollection();
      var data = [
      ];


      $('#carrier').on('hidden.bs.dropdown', function () {
        $('#payer').val($('#carrier').val());
      });

      $('#depositDate').val(date.toISOString().slice(0,10));

      contactsCollection.add(tableValues);

      var shouldExecute = true;

      var receiptTotal = 0;
      var premiumTotal = 0;
      var unappliedAmount = 0;


      var $container = $("#grid");
      $container.handsontable({
        data: data,
        dataSchema: makeClient,
        contextMenu: true,
        autoWrapRow: true,
        colHeaders: ["Client Name", "Client Code", "Policy #", "Client/Carrier/Product/Policy #/GL Code/Org Unit", "Period", "Premium Amount", "Receipt Amount", "Notes"],
        colWidths: [125, 100, 100, 275, 100, 125, 125, 85],
        columns: [
          {
            data: 'name',
            type: 'autocomplete',
            source: [], //empty string is a valid value
            strict: false
          },
          {
            data: "code",
            type: 'autocomplete',
            strict: false

          },
          {
            data: "policy",
            type: 'autocomplete',
            strict: false
          },
          {
            data: "clientInfo",
            type: "autocomplete",
            source: []
          },
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
        beforeChange: function(changes, source) {
          var instance = $container.handsontable('getInstance');
          var settings = instance.getSettings();
          var data;

          var obj = {};
          if(changes && changes[0]){
            var key = changes[0][1];
            obj[key] = changes[0][3];
          }


          if(changes && shouldExecute && changes[0][1] === 'name'){
            shouldExecute = false;

            data = _.where(tableValues, obj);

            var settings = instance.getSettings();
            settings.columns[1].source = _.pluck(data, 'code');
            settings.columns[3].source = _.pluck(data, 'clientInfo');
            instance.updateSettings(settings);
            return;
          } else if(changes && shouldExecute && changes[0][1] === 'code'){
            shouldExecute = false;

            data = _.where(tableValues, obj);

            var results = data[0];

            settings.columns[2].source = _.pluck(data, 'policy');
            instance.updateSettings(settings);
          } else if(changes && shouldExecute && changes[0][1] === 'policy'){

            data = _.where(tableValues, obj);

            var results = data[0];

            settings.columns[3].source = _.pluck(data, 'clientInfo');
            instance.updateSettings(settings);
          }

          shouldExecute = true;
        },
        afterChange: function (changes, source){
          var instance = $container.handsontable('getInstance');
          if(changes && changes[0][1] === 'premiumAmount'){
            premiumTotal = 0;
            var premiumColumn = instance.getDataAtCol(5);
            var premiumColumnFlat = _.compact(premiumColumn);
            for(var k=0; k < premiumColumnFlat.length; k++){
              premiumTotal += premiumColumnFlat[k];
            }
            $('#premiumTotal').text('$' + premiumTotal);
          } else if(changes && changes[0][1] === 'receiptAmount'){
            receiptTotal = 0;
            var receiptColumn = instance.getDataAtCol(6);
            var receiptColumnFlat = _.compact(receiptColumn);
            for(var k=0; k < receiptColumnFlat.length; k++){
              receiptTotal += receiptColumnFlat[k];
            }
            $('#receiptTotal').text('$' + receiptTotal);

            unappliedAmount = $('#checkAmount').val() - receiptTotal;

            if(unappliedAmount === 0){
              $('#unappliedAmount').addClass("correctAmount");
            } else {
              $('#unappliedAmount').removeClass("correctAmount");
            }

            $('#unappliedAmount').val(unappliedAmount);
          }
        },
        minSpareRows: 1 //see notes on the left for `minSpareRows`
      });

      function makeClient() {
        return new ClientModel();
      }

    }

  });

  return HomeView;

});