import mongoose from "mongoose";
const tempUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
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
  otp: { 
    type: String 
  },
  otpExpires: { 
    type: Date 
  },
});

const TempUser = mongoose.model('TempUser', tempUserSchema);

export default TempUser
