"use strict";
require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require('body-parser');
const {Subscription} = require('./models/subscriptions');
const mongoose = require('mongoose');
const cors = require("cors");
const passport = require('passport');

const { PORT, CLIENT_ORIGIN } = require("./config");
const jsonParser = bodyParser.json();
// Here we use destructuring assignment with renaming so the two variables
// called router (from ./users and ./auth) have different names
// For example:
// const actorSurnames = { james: "Stewart", robert: "De Niro" };
// const { james: jimmy, robert: bobby } = actorSurnames;
// console.log(jimmy); // Stewart - the variable name is jimmy, not james
// console.log(bobby); // De Niro - the variable name is bobby, not robert
const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

mongoose.Promise = global.Promise;

const { dbConnect } = require("./db-mongoose");
//const {dbConnect} = require("./db-knex");
const jwtAuth = passport.authenticate('jwt', { session: false });

const app = express();  
// Logging
//app.use(morgan('common'));
app.use(
  morgan(process.env.NODE_ENV === "production" ? "common" : "dev", {
    skip: (req, res) => process.env.NODE_ENV === "test"
  })
);

passport.use(localStrategy);
passport.use(jwtStrategy);
app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

// app.use(function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
//   res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
//   if (req.method === 'OPTIONS') {
//     return res.sendStatus(204);
//   }
//   next();
// });



app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);



// A protected endpoint which needs a valid JWT to access it
// app.get('/api/protected', jwtAuth, (req, res) => {
//   return res.json({
//     data: 'rosebud'
//   });
// });

//app.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

app.get("/api/protected/subscriptions", jwtAuth, (req, res, next) => {
  Subscription.find()
  .then(results => {
    res.json(results);  //
  })
  .catch(err => {
    next(err);
  });
  
  //const subscriptions = getSubscriptions()

  });
  app.get('/api/protected/subscriptions/:id', jwtAuth, jsonParser, (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;
  // console.log('req: ', req);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error('The `id` is not valid');
      err.status = 400;
      return next(err);
    }
    //Subscription.findOne({ _id: id})  
    Subscription.findOne({ _id: id, userId })
      .populate('recipients')
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
  
  // app.post("/api/protected/subscriptions", jwtAuth, jsonParser, (req, res, next) => {
    app.post("/api/subscriptions",  jsonParser, (req, res, next) => {
    console.log('subcriptions req.body: ', req.body);
    //console.log('subscriptions req.user._id: ', req.user._id);
    // const userId = req.user._id;
    //const userId = req.user._id;
    const { userId,  productCode, productName, frequency, duration, startDate, recipientFirstName, recipientLastName, recipientCompany, recipientStreetAddress, recipientAptSuite, recipientCity, recipientState, recipientZipcode, recipientPhone, recipientMessage } = req.body;
    const newSubscription = { userId, productCode, productName, frequency, duration, startDate, recipientFirstName, recipientLastName, recipientCompany, recipientStreetAddress, recipientAptSuite, recipientCity, recipientState, recipientZipcode, recipientPhone, recipientMessage  };  
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
  // console.log('put called. req.body = ', req.body);

  const updateSubscription = {};
  const updateFields = [productCode, startDate, recipientFirstName, recipientLastName, recipientCompany, recipientStreetAddress, recipientAptSuite, recipientCity, recipientState, recipientZipcode, recipientPhone, recipientMessage];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateSubscription[field] = req.body[field];
    }
  });
  const id = req.params.id;

  // console.log(`Updating subscription \`${req.params.id}\``);
  Subscription.findByIdAndUpdate(id, updateSubscription, { new: true })
    .then(result => {
      if (result) {
        // console.log('put request response is: ', res);
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
// try to delete that item 
  app.delete('/api/subscriptions/:id', (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;
  
    /***** Never trust users - validate input *****/
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error('The `id` is not valid');
      err.status = 400;
      return next(err);
    }
    //Subscription.deleteOne({ _id: id})
    Subscription.deleteOne({ _id: id, userId })
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
