'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const SubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productCode: {type: String, default: ''},
  productName:{type: String, default: ''},
  productSize: {type: String, default: ''},
  status: {type: String, default: 'active'},
  startDate: {type: Date, default: null},
  duration: {type: String, default: ''},
  frequency:{type: String, default: ''},
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
    startDate: this.startDate || '',
    duration: this.duration || '',
    frequency: this.frequency || '',
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
    delete ret._id; // delete `_id`
  }
});
module.exports = {Subscription};
