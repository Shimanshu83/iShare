
require('dotenv').config() ; 
const mongoose = require("mongoose");


async function connectDB() {
  
  mongoose.connect(
    process.env.MONGO_CONNECTION_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );

  const connect = mongoose.connection;

  try{
  await connect.once("open", () => {
      console.log("database connected");
    })
  }
  catch(err) {
    console.log(err)
  }
  
    
    
}

module.exports = connectDB;
