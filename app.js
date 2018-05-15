let express = require('express');
let bodyParser = require('body-parser');

let app = express();
let prices = require('./controllers/prices.js');
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

// route to get current prices
app.get('/prices', prices.getCurrentPrices);

// routes for users
app.get('/users/:username', users.getUser);
app.post('/users', users.createUser);
app.get('/users/:user_id/portfolio', users.getPortfolio);
app.get('/users/:user_id/orders', users.getOrders);

// route to create a new order
app.post('/orders', orders.createOrder);

app.listen('3000', function() {
  console.log("listening on port 3000");
});

module.exports = app; // for testing
