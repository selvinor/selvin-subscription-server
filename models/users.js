'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    _id: this._id,
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || '',
    email: this.email|| '',
    phone: this.phone|| '',
    subscriptions: this.subscriptions|| ''
  };
};
UserSchema.set('toObject', {
  virtuals: true,
  versionKey: false, 
  transform: (doc, ret) => {

    delete ret.password;
    delete ret.__v;
  }
});


UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false, 
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
  }
});

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

module.exports = mongoose.model('User', UserSchema);
