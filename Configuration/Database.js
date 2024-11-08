const mongoose = require('mongoose')
require('dotenv').config()
const MONGODB_URL = process.env.MONGODB_URL

exports.connect = () =>{
    mongoose.connect(MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(()=> console.log("DB connected successfully"))
    .catch((err)=>{
        console.log("DB connection failed");
        console.log(err);
        process.exit(1);
    });
};