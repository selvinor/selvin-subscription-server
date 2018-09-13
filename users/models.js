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
  productName:{type: String, default: 'Designer\'s Choice Arrangement'},
  productColor: {type: Boolean, default: true},
  productSize: {type: String, default: 'standard'},
  frequency:{type: String, default: 'monthly'},
  duration: {type: String, default: '3'},
  gift: {type: Boolean, default: true},
  color: {type: String, default: 'color'},
  suspended: {type: Boolean, default: false},
  delivery: {type: Boolean, default: true},
  recipients: {type: Array, default: []}
});

SubscriptionSchema.methods.serialize = function() {
  return {
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
module.exports = {Subscription};
