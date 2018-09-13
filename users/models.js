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
  buyerEmail: {type: String, default: ''},
  buyerFirstName: {type: String, default: ''},
  buyerLastName: {type: String, default: ''},
  buyerPhone: {type: String, default: ''},
  productName:{type: String, default: 'Designer\'s Choice Arrangement'},
  productColor: {type: Boolean, default: true},
  productSize: {type: String, default: 'standard'},
  frequency:{type: String, default: 'monthly'},
  duration: {type: String, default: '3'},
  gift: {type: Boolean, default: true},
  color: {type: Boolean, default: true},
  suspended: {type: Boolean, default: false},
  delivery: {type: Boolean, default: true},
  recipients: {type: Array, default: [
    {
      firstName : {type: String, default: ''},
      lastName :  {type: String, default: ''},
      address1 :  {type: String, default: ''},
      address2 :  {type: String, default: ''},
      city :  {type: String, default: ''},
      state :  {type: String, default: ''},
      zipcode :  {type: String, default: ''},
    }

  ]}
});

SubscriptionSchema.methods.serialize = function() {
  return {
    buyerEmail: this.buyerEmail || '',
    buyerFirstName: this.buyerFirstName || '',
    buyerLastName: this.buyerLastName || '',
    buyerPhone: this.buyerPhone || '',
    productName: this.productName || '',
    productColor: this.productColor || '',
    productSize: this.productSize || '',
    frequency: this.frequency || '',
    duration: this.duration || '',
    gift: this.gift || '',
    color: this.color || '',
    suspended: this.suspended || '',
    delivery: this.delivery || '',
    recipients: this.recipients || ''
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
