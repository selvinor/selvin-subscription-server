'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''},
  email: {type: String, default: ''},
  phone: {type: String, default: ''},
  subscriptions: [
    {
      subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' }
    }
  ]
});

UserSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || '',
    email: this.email|| '',
    phone: this.phone|| '',
    subscriptions: this.subscriptions|| ''
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);
// Add `createdAt` and `updatedAt` fields
UserSchema.set('timestamps', true);

// Customize output for `res.json(data)`, `console.log(data)` etc.
UserSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
  //  delete ret._id; // delete `_id`
    delete ret.password; // delete `_id`
  }
});

const SubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productCode: {type: String, default: ''},
  productName:{type: String, default: ''},
  productSize: {type: String, default: ''},
  status: {type: String, default: 'active'},
  duration: {type: String, default: ''},
  frequency:{type: String, default: ''},
  startDate: {type: Date, default: null},
  color: {type: Boolean, default: true},
  recipientFirstName : {type: String, default: ''},
  recipientLastName :  {type: String, default: ''},
  recipientCompany :  {type: String, default: ''},
  recipientStreetAddress :  {type: String, default: ''},
  recipientAptSuite :  {type: String, default: ''},
  recipientCity :  {type: String, default: ''},
  recipientState :  {type: String, default: ''},
  recipientZipcode :  {type: String, default: ''},
  recipientPhone :  {type: String, default: ''},
  recipientMessage :  {type: String, default: ''}
});

SubscriptionSchema.methods.serialize = function() {
  return {
    userId: this.userId || '',
    productCode: this.productCode || '',
    productName: this.productName || '',
    productSize: this.productSize || '',
    status: this.status || '',
    duration: this.duration || '',
    frequency: this.frequency || '',
    startDate: this.startDate || '',
    color: this.color || '',
    recipientFirstName : this.recipientFirstName || '',
    recipientLastName :  this.recipientLastName || '',
    recipientCompany: this.recipientCompany || '',
    recipientStreetAddress :  this.recipientStreetAddress || '',
    recipientAptSuite :  this.recipientAptSuite || '',
    recipientCity :  this.recipientCity || '',
    recipientState :  this.recipientState || '',
    recipientZipcode :  this.recipientZipcode || '',
    recipientPhone :  this.recipientPhone || '',
    recipientMessage :  this.recipientMessage || ''

  };
};
const Subscription = mongoose.model('Subscription', SubscriptionSchema);
// Add `createdAt` and `updatedAt` fields
SubscriptionSchema.set('timestamps', true);

// Customize output for `res.json(data)`, `console.log(data)` etc.
SubscriptionSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  versionKey: false,  // remove `__v` version key
  transform: (doc, ret) => {
//    delete ret._id; // delete `_id`
  }
});
module.exports = {User, Subscription};
