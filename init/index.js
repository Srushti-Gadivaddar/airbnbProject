const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listings");

const MONGO_URL = 'mongodb://127.0.0.1:27017/Wonderlust';

async function main() {
  await mongoose.connect(MONGO_URL);
}

main().then(() => {
    console.log("Mongo DB is connected");
}).catch((err) => {
    console.log(err);
});


const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "68f34d00ef5ec840e0533603"}))
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}                                                                             

initDB();