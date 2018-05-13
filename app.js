let express = require('express');
let bodyParser = require('body-parser');

let app = express();
let prices = require('./controllers/prices.js');
let portfolio = require('./controllers/portfolio.js');
let orders = require('./controllers/orders.js');
let users = require('./controllers/users.js');

//parse application/json and look for raw text                                        
app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));  

app.get('/', (req, res, next) => {
  res.send('Hello World!');
});

app.get('/prices', prices.getCurrentPrices);
app.post('/users', users.createUser);
app.get('/portfolio', portfolio.getPortfolio);
app.get('/orders', orders.getOrders);
app.post('/orders', orders.createOrder);

app.listen('3000', function() {
  console.log("listening on port 3000");
});

module.exports = app; // for testing
