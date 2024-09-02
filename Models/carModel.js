import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  providerId: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  pricePerHour: {
    type: Number,
    required: true,
  },
  pricePerDay: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  registrationNumber:{
    type:String,
    required:true
  },
  availability: {
    type: Boolean,
    default: true,
  },
  images: [
    String
  ], 
  ratings: {
    type: Number,
    default: 0,
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

carSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});
const Car = mongoose.model('Car', carSchema);

export default Car
