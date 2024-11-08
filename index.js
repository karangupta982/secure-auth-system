const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const database = require('./Configuration/Database')
const cors = require('cors')
const userRoute = require('./Route/user.js')



app.use(cors({
    origin: "https://rad-heliotrope-448f23.netlify.app",
    credentials:true,
}))

// app.use(
// 	cors({
// 		origin: "*",
// 		credentials: true,
// 	})
// );


require("dotenv").config()


port = process.env.PORT || 4000

app.use(express.json())
app.use(cookieParser())

database.connect();

app.use("/api/v1/auth",userRoute);

app.listen(port, (req,res) =>{
    console.log(`Server is running on port ${port}`)
})


