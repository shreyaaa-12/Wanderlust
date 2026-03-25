const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
   .then(() => {
    console.log("connect to DB");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

/*const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner:"68c0ce5b5e91d487431aba24"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();*/

const initDB = async () => {
    try {
        await Listing.deleteMany({});
        
        // Log to verify the owner is being added
        const dataWithOwner = initData.data.map((obj) => ({
            ...obj, 
            owner: "68c0ce5b5e91d487431aba24"
        }));
        
        console.log("Sample data with owner:", dataWithOwner[0]); // Check first item
        
        await Listing.insertMany(dataWithOwner);
        console.log("Data was initialized");
    } catch (error) {
        console.error("Error initializing data:", error);
    }
};

initDB();