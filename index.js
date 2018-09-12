"use strict";
require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const morgan = require("morgan");
const passport = require('passport');
const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

mongoose.Promise = global.Promise;

const { PORT, CLIENT_ORIGIN } = require("./config");
const { dbConnect } = require("./db-mongoose");
//const {dbConnect} = require("./db-knex");



const app = express();
// Logging
app.use(morgan('common'));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

const getSubscriptions = () => {
  console.log("getSubscriptions  called");
  return [{
    "userId" : 1,
    productType : "Designer's Choice Arrangement",
    productColor :  "color",
    productSize :  "standard",
    frequency : "monthly", 
    duration :  "3",
    gift :  true,
    giftMessage :  null,
    color :  true,
    suspended :  false, 
    delivery:  true,
    recipients :  [
      {
        "firstName" : "Jane",
        "lastName" : "User",
        "address1" : "123 NW Maple St.",
        "address2" : null,
        "city" : "Portland",
        "state" : "Oregon",
        "zipcode" : 97204
      },
      {
        "firstName" : "Jill",
        "lastName" : "User",
        "address1" : "222 SE Main St.",
        "address2" : null,
        "city" : "Portland",
        "state" : "Oregon",
        "zipcode" : 97201
      },
      {
        "firstName" : "Jody",
        "lastName" : "User",
        "address1" : "17 NE Tough Rd.",
        "address2" : null,
        "city" : "Portland",
        "state" : "Oregon",
        "zipcode" : 97210
      }
    ]
  },
  {
    userId :  2,
    productType : "Designer's Bouquet",
    productColor :  "color",
    productSize :  "standard",
    frequency : "monthly", 
    duration :  "6",
    gift :  true,
    giftMessage :  null,
    color :  true,
    suspended :  false, 
    delivery:  true,
    recipients :  [
      {
        "firstName" : "Bar",
        "lastName" : "Foo",
        "address1" : "77 SE Dump Rd.",
        "address2" : null,
        "city" : "Portland",
        "state" : "Oregon",
        "zipcode" : 97215
      }
    ]
  }];
}
app.use(
  morgan(process.env.NODE_ENV === "production" ? "common" : "dev", {
    skip: (req, res) => process.env.NODE_ENV === "test"
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.get("/api/subscriptions", (req, res, next) => {
  //get data from datastore
  const subscriptions = getSubscriptions()
    if (!subscriptions) {
      const err = error("No subscriptions yet!");
      res.status = 400;
      return next(err);
    }
    res.json(subscriptions);
  });

  app.post("/api/subscriptions", (req, res, next) => {
    const { productType, productColor, productSize, frequency, duration, gift, color, suspended, delivery, recipients } = req.body;
    //const userId = req.user.id;
    //console.log("req.user", req.user);
    /***** Never trust users - validate input *****/
    if (!product) {
      const err = new Error("Missing `product` in request body");
      err.status = 400;
      return next(err);
    }
  
    // if (folderId && !mongoose.Types.ObjectId.isValid(userId)) {
    //   const err = new Error("The `userId` is not valid");
    //   err.status = 400;
    //   return next(err);
    // }
    //console.log("recipients", recipients);
  
    // if (recipients) {
    //   recipients.filter((recipient) => {
    //     //console.log("tags", tag);
    //     if (!mongoose.Types.ObjectId.isValid(recipient)) {
    //       const err = new Error("The `recipients` array contains an invalid `id`");
    //       err.status = 400;
    //       return next(err);
    //     }
    //   })
    // };

  
    const newSubscription = { productType, productColor, productSize, frequency, duration, gift, color, suspended, delivery, recipients };
  
    Subscription.create(newSubscription) //
      .then(result => {
        res
          .location(`${req.originalUrl}/${result.id}`)
          .status(201)
          .json(result); //
      })
      .catch(err => {
        next(err);
      });
  });
  
function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on("error", err => {
      console.error("Express failed to start");
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
