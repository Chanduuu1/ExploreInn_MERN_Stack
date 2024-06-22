const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
  .then(() => {
    console.log("Connected with DB!");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(
    "mongodb+srv://shekharkrish13:PEd5PanNKKhKoltg@cluster0.zpn80ac.mongodb.net/?retryWrites=true&w=majority"
  );
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6673e15a5fc0817aa50f441c",
  }));
  await Listing.insertMany(initData.data); // initData is the object which has been exported from data.js and .data is the key in that obj jiska value will be now obtained.
  console.log("data was initialized");
};

initDB();
