import mongoose from "mongoose";

const webDataSchema = new mongoose.Schema({ 
  totalCities:{
    type: Number,
  },
  totalCitiesNames: [
    String
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
const WebData = mongoose.model('WebData', webDataSchema);

export default WebData
