# CURRENCY EXCHANGE RATE SERVER

Currency Exchange Rate server is a simple server that uses the OpenExchange API to update crypto/fiat currencies on an AirTable base used to manage currency rates for currency exchanges.

## SET UP

You will need to [sign up](https://airtable.com)
 for an Airtable account. Once you have an account:

1) Create an airtable with this schema:
Columns: Name, FXRate, Our Buy Margin, We Buy, Our Sell Margin, We Sell

2) Add your currencies under the 'Name' Column.

3) Create a file called config.js with your API keys and AIRTABLE INFO
```javascript
module.exports = {
  AIRTABLE_API_KEY      : 'YOUR AIRTABLE API KEY',
  OPEN_EXCHANGE_API_KEY : 'YOUR OPEN EXCHANGE API KEY',
  AIRTABLE_BASE_NAME    : 'YOUR AIRTABLE BASE NAME',
  AIRTABLE_BASE_ID      : 'YOUR AIRTABLE BASE',
  TIME_INTERVAL_UPDATE  : TIME INTERVAL IN MINUTES FOR HOW OFTEN YOU WANT TO UPDATE YOUR DATA
};
```

4) Now run:
```
npm install
node server.js
```

If everything worked, you should see the message:
```
 Listening on port 8080. Running Currency Exchange Server.
```

