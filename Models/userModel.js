import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['renter', 'provider'],
    default: 'renter',
  },
  isProvider: {
    type: Boolean,
    default: false,
  },
  carsProvided:{
    type: Array,
  },
  carsNotConfirmed:{
    type: Array,
  },
  otp: { 
    type: String 
  },
  otpExpires: { 
    type: Date 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});
const User = mongoose.model('User', userSchema);

export default User
