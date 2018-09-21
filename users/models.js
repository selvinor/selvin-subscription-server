'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''}
});

UserSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const SubscriptionSchema = mongoose.Schema({
  productCode: {type: String, default: ''},
  productName:{type: String, default: ''},
  productSize: {type: String, default: ''},
  status: {type: String, default: 'active'},
  frequency:{type: String, default: ''},
  duration: {type: String, default: ''},
  startDate: {type: Date, default: null},
  color: {type: Boolean, default: true},
  senderEmail: {type: String, default: ''},
  senderFirstName: {type: String, default: ''},
  senderLastName: {type: String, default: ''},
  senderPhone: {type: String, default: ''},
  recipientFirstName : {type: String, default: ''},
  recipientLastName :  {type: String, default: ''},
  recipientCompany :  {type: String, default: ''},
  recipientStreetAddress :  {type: String, default: ''},
  recipientAptSuite :  {type: String, default: ''},
  recipientCity :  {type: String, default: ''},
  recipientState :  {type: String, default: ''},
  recipientZipcode :  {type: String, default: ''},
  recipientPhone :  {type: String, default: ''}

});

SubscriptionSchema.methods.serialize = function() {
  return {
    productCode: this.productCode || '',
    productName: this.productName || '',
    productSize: this.productSize || '',
    status: this.status || '',
    frequency: this.frequency || '',
    duration: this.duration || '',
    startDate: this.startDate || '',
    color: this.color || '',
    senderEmail: this.senderEmail || '',
    senderFirstName: this.senderFirstName || '',
    senderLastName: this.senderLastName || '',
    senderPhone: this.senderPhone || '',
    recipientFirstName : this.recipientFirstName || '',
    recipientLastName :  this.recipientLastName || '',
    recipientCompany: this.recipientCompany || '',
    recipientStreetAddress :  this.recipientStreetAddress || '',
    recipientAptSuite :  this.recipientAptSuite || '',
    recipientCity :  this.recipientCity || '',
    recipientState :  this.recipientState || '',
    recipientZipcode :  this.recipientZipcode || '',
    recipientPhone :  this.recipientPhone || ''
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
    delete ret._id; // delete `_id`
  }
});
module.exports = {Subscription};
