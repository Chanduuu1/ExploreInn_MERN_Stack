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
  await mongoose.connect("mongodb://127.0.0.1:27017/ExploreInn");
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6668861bb6209ae1e07bf30a",
  }));
  await Listing.insertMany(initData.data); // initData is the object which has been exported from data.js and .data is the key in that obj jiska value will be now obtained.
  console.log("data was initialized");
};

initDB();
