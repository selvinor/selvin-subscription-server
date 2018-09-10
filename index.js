'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');

const app = express();

const getProducts = () => {
  console.log('getProducts  called');
  return [
    "Designer's Lobby",
    "Designer's Foyer",
    "Designer's Choice Arrangement",
    "Designer's Bouquet"
  ];
}
const getSubscriptions = (product='Designer\'s Choice Arrangement', frequency='monthly', duration=3) => {
  console.log('getSubscriptions  called');
  return [{
    "product" : product,
    "frequency" : frequency,
    "duration" : duration,
    "gift" : true,
    "color": true,
    "suspend": false,
    "delivery" : true
  }];
}

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.get('/api/subscriptions', (req, res, next) => {
  //get data from datastore
  const subscriptions = getSubscriptions()
    if (!subscriptions) {
      const err = error('No subscriptions yet!');
      res.status = 400;
      return next(err);
    }
    res.json(subscriptions);
  });
  app.get('/api/products', (req, res, next) => {
    //get data from datastore
    const products = fetchProducts()
      if (!products) {
        const err = error('No products yet!');
        res.status = 400;
        return next(err);
      }
      res.json(products);
    });
  
  


function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
