'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
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
    userName: this.userName || '',
    firstName: this.firstName || '',
    lastName: this.lastName || '',
    email: this.email|| '',
    phone: this.phone|| '',
    subscriptions: this.subscriptions|| ''
  };
};
userSchema.set('toObject', {
  virtuals: true,
  versionKey: false, 
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.password;
    delete ret.__v;
  }
});


userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false, 
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.password;
    delete ret.__v;
  }
});

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

module.exports = mongoose.model('User', userSchema);
