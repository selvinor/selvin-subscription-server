"use strict";
require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require('body-parser');
const {Subscription} = require('./users/models');
const mongoose = require('mongoose');
const cors = require("cors");

const passport = require('passport');

const { PORT, CLIENT_ORIGIN } = require("./config");
const jsonParser = bodyParser.json();
// const { router: usersRouter } = require('./users');
 const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');


mongoose.Promise = global.Promise;

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

// passport.use(localStrategy);
// passport.use(jwtStrategy);

//app.use('/api/users/', usersRouter);
//app.use('/api/auth/', authRouter);

//const jwtAuth = passport.authenticate('jwt', { session: false });
/*
const getSubscriptions = () => {
  return [{
    "userId" : 1,
    productName : "Designer's Choice Arrangement", 
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
    productName : "Designer's Bouquet",
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
*/
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
  Subscription.find()
  .then(results => {
    res.json(results);  //
  })
  .catch(err => {
    next(err);
  });
  
  //const subscriptions = getSubscriptions()

  });
  app.get('/api/subscriptions/:id', jsonParser, (req, res, next) => {
    const { id } = req.params;
    //const userId = req.user.id;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error('The `id` is not valid');
      err.status = 400;
      return next(err);
    }
    Subscription.findOne({ _id: id})  
   // Subscription.findOne({ _id: id, userId })
      //.populate('recipients')
      .then(result => {
        if (result) {
          res.json(result);
        } else {
          next();
        }
      })
      .catch(err => {
        next(err);
      });
  });
  
  app.post("/api/subscriptions", jsonParser, (req, res, next) => {
    const { productName, productColor, productSize, frequency, duration, gift, color, suspended, delivery, recipients = [] } = req.body;
    const newSubscription = { productName, productColor, productSize, frequency, duration, gift, color, suspended, delivery, recipients };
    
    //const userId = req.user.id;
    //console.log("req.user", req.user);
    /***** Never trust users - validate input *****/
    // if (!productName) {
    //   const err = new Error("Missing `product` in request body");
    //   err.status = 400;
    //   return next(err);
    // }
  
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
app.put('/api/subscriptions/:id', jsonParser,  (req, res, next) => {
  console.log('put called. req.body = ', req.body);

  const updateSubscription = {};
  const updateFields = ['frequency', 'duration', 'gift', 'color', 'suspended', 'delivery', 'recipients' ];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateSubscription[field] = req.body[field];
    }
  });
  const id = req.params.id;

  console.log(`Updating subscription \`${req.params.id}\``);
  Subscription.findByIdAndUpdate(id, updateSubscription, { new: true })
    .then(result => {
      if (result) {
        console.log('put request response is: ', res);
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
  });
// when DELETE request comes in with an id in path,
// try to delete that item from ShoppingList.
  app.delete('/api/subscriptions/:id', (req, res, next) => {
    const { id } = req.params;
    //const userId = req.user.id;
  
    /***** Never trust users - validate input *****/
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error('The `id` is not valid');
      err.status = 400;
      return next(err);
    }
    Subscription.deleteOne({ _id: id})
   // Subscription.deleteOne({ _id: id, userId })
      .then(result => {
        if (result.n) {
          res.sendStatus(204);
        } else {
          res.sendStatus(404);
        }
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
