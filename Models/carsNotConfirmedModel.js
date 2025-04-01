import mongoose from "mongoose";

const carNotConfirmedSchema = new mongoose.Schema({
  provider_id:{
    type: String,
    required: true
  },
  providerEmailId: {
    type: String,
    required: true,
  },
  providerName:{
    type:String,
    required:true
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
  carType:{
    type:String,
    required:true
  },
  transmissionType:{
    type:String,
    required:true
  },
  fuelType:{
    type:String,
    required:true
  },
  seats:{
    type:String,
    required:true
  },
  pricePerHour: {
    type: Number,
    required: true,
  },
  pricePerDay: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
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
  images: [{
    type: String,
    required: true
  }], 
  ratings: [
    Number
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

carNotConfirmedSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});
const CarNotConfirmed = mongoose.model('CarNotConfirmed', carNotConfirmedSchema);

export default CarNotConfirmed
