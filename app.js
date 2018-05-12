let express = require('express');
let app = express();

let prices = require('./controllers/prices.js');
let portfolio = require('./controllers/portfolio.js');
let orders = require('./controllers/orders.js');

app.get('/', (req, res, next) => {
  res.send('Hello World!');
});

app.get('/prices', prices.getCurrentPrices);
app.get('/portfolio', portfolio.getPortfolio);
app.get('/orders', orders.getOrders);
app.post('/orders', orders.createOrder);


app.listen('3000', function() {
  console.log("listening on port 3000");
})