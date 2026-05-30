const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  const data = initData.data.map((obj) => ({
    ...obj,
    owner: "6a0d540cdde6b6276ef11635",
  }));

  await Listing.insertMany(data);
  console.log("Data was initialized");
};

main()
  .then(async () => {
    console.log("connected to database");
    await initDB();
    await mongoose.connection.close();
  })
  .catch((err) => {
    console.log(err);
  });