# salt-cryptoexchange-service
SALT Lending

Donatella wants to educate her kids about investing in cryptocurrencies. To accomplish this, she will create a virtual crypto exchange where they can pretend to buy and sell cryptocurrencies. You are Donatella.

Write a web app (preferably in React and Node, but not required) that tracks the price of Bitcoin (in USD), as well as the prices of Litecoin, Dogecoin, and Monero (in BTC). Each kid should start with 10,000 USD and 0 balance for each crypto asset. The app should allow the kids to view the current prices of assets, place orders, view their portfolio distribution, and view the total value. To keep things simple, ALL TRADES MUST INVOLVE BTC. The kids must use USD to buy BTC, then they can use BTC to buy and sell alts. Obviously, we need to know which kid is making the trade, but don't prioritize authentication. Use a DB of your choice.

## Installation

### Dependencies

To get started, clone the repot and continue with the steps below:

#### Binary Dependencies (Mac)

Install Homebrew
````
open http://brew.sh
````

Install node
node installation will include `npm`

#### Packages

Install package dependencies
```
npm install
```

#### Database

Setup MariaDB

##### MariaDB Installation and setup (Mac)

````sh
brew install Mariadb
mysql.server start
````

Running locally need to set up new DB for salt and 'salt' user
```bash
mysql -u root -p -e "CREATE USER 'salt'@'localhost' IDENTIFIED BY 'salt';"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON *.* TO 'salt'@'localhost';"
mysql -u salt -p -e "CREATE DATABASE salt"
```

## Testing
```sh
   # run all tests
   npm test
```

A test DB is used specificially for testing
```bash
mysql -u salt -p -e "CREATE DATABASE salttest;"
mysql -u salt -p salttest < migrations/salt-init.sql
```

## Running Locally

A DB needs to be set up, default name for db is salt
```bash
mysql -u salt -p -e "CREATE DATABASE salt;"
mysql -u salt -p salt < migrations/salt-init.sql

```