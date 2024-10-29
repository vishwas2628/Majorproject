import mongoose from "mongoose";
import { Review } from './review.js'; 
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
      filename: String,
      url: String,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  reviews:[
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ],
  owner :{
    type:Schema.Types.ObjectId,
    ref: "User",
  },
  geometry:{ 
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  // category:{
  //   type: String,
  //   enum:["farms", "castle","mountain"],
  // },
  });

  listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
      await Review.deleteMany({_id : {$in: listing.reviews}});
        }
  })

export const Listing = mongoose.model("Listing", listingSchema);
