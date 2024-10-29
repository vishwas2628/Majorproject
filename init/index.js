import { data } from './data.js';
import mongoose from "mongoose";
import {Listing} from '../models/listing.js';


const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlist";
main().then((res) =>{
    console.log("connected successfully");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    let initData = data.map((obj)=>({...obj, owner:'671b6e4e1d2e0494a418fa2c'}));
    await Listing.insertMany(initData);
    console.log("data initilize");
};

initDB();