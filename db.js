const mongoose = require("mongoose"); 

const startMongo = async() => {
    mongoose.connect("mongodb://localhost/user-auth")
    .then(() =>{ 
        console.log("connected to database!");
    })
    .catch((error) => {
        "Couldn't connect to mongodb".error; 
    });
};

module.exports = startMongo; 
