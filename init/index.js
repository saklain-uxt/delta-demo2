const mongoose = require('mongoose');
const initData=require('./data.js');
const Listing = require('../models/listing.js'); // Assuming you have a listing model defined in models/listing.js
const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';

main()
.then(() => {
  console.log('Connected to MongoDB');
  
})
.catch((err)=>{
      console.log('Error connecting to MongoDB', err)
})



async function main() {
  await mongoose.connect(MONGO_URL);
}
const initDB=async()=>{
      await Listing.deleteMany({});
 initData.data=initData.data.map((obj)=>({...obj,owner:"6887359052aa13c7cbb991d2"}));
      await Listing.insertMany(initData.data);
      console.log("Database initialized with sample data");
};
initDB();
