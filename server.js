var Airtable = require('airtable');
var express = require('express');
var oxr = require('open-exchange-rates');
var fx = require('money');
var app = express();
var PORT = process.env.PORT || 8080;
var config = require('./config');

// API KEYS
const AIRTABLE_API_KEY      = config.AIRTABLE_API_KEY;
const OPEN_EXCHANGE_API_KEY = config.OPEN_EXCHANGE_API_KEY;
const AIRTABLE_BASE_ID      = config.AIRTABLE_BASE_ID;
const TIME_INTERVAL_UPDATE  = config.TIME_INTERVAL_UPDATE;

const BASE_CURRENCY = 'CAD';
var fiat_currencies = [];

var base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

// Set the API key for Open Exchange
oxr.set({ 
  app_id: OPEN_EXCHANGE_API_KEY,
});

// Fetch new data based on TIME_INTERVAL_UPDATE value
var the_interval = TIME_INTERVAL_UPDATE * 60 * 1000;
setInterval(function() {
  console.log('UPDATING CURRENCIES');
  getRates();
}, the_interval);

// Fetch the rates from the Open Exchange API
function getRates(){
  oxr.latest(function() {
    fx.rates = oxr.rates;
    fx.base = oxr.base;

    // convert the rates and use CAD as base:
    var fiat_rates = fx.rates;

    Object.keys(fiat_rates).forEach(function(key) {
      var newVal = fx(1).from(key).to(BASE_CURRENCY);
      var obj = {};
      obj[key] = newVal;
      fiat_currencies.push(obj);
    });
  });
}

// Update the Echange rate values
function updateExchangeRate(name, newRate, id){
  base('Exchange Rates').update(id, {
    'FXRate': newRate
  }, function(err, record) {
    if (err) { console.log(err); return; }
    console.log(record);
  });
}

base('Exchange Rates').select({
    // Selecting the first 3 records in Main View:
    view: 'Main View'
}).eachPage(function page(records, fetchNextPage) {

  // Loop through each record and update the currency
  records.forEach(function updateRecords(record) {

    // Get the ID
    var id = record['_rawJson']['id'];
    
    // Get the name
    var name = record.get('Name');

    // Loop through the currencies from openExchange
    for (var i = 0; i < fiat_currencies.length; i++) {
      var currencyName = Object.keys(fiat_currencies[i])[0];
      var currencyRate = Object.values(fiat_currencies[i])[0];
      
      // if the currency is on openExchange
      if (currencyName === name) {
        updateExchangeRate(currencyName, currencyRate, id);
      }
    }

  });
  // To fetch the next page of records, call `fetchNextPage`.
  // If there are more records, `page` will get called again.
  // If there are no more records, `done` will get called.
  fetchNextPage();

}, function done(error) {
  if (error) {
      console.log(error);
  }
});

app.listen(PORT, function(error) {
  if (error) {
    console.error(error);
  } else {
    getRates();
    console.info('==> 🌎  Listening on port %s. Running Currency Exchange Server.', PORT, PORT);
  }
});

