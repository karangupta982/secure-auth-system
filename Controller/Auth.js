const { response } = require("express");
const User = require('../Model/User')
const {SESSIONS} = require('./sessionsStore')
const bcrypt = require('bcrypt');    
const crypto = require('crypto');    
const jwt = require('jsonwebtoken');


exports.signup = async (req,res)=>{
    try{
        // console.log("inside signup controller")
        const {userName,email,password} = req.body;
        // console.log(userName,email,password);
        if(!userName || !email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required."
            })
        }
        const existingUser = await User.findOne({email});
        // console.log("after db",existingUser)
        if(existingUser){
            return res.status(403).json({
                success:false,
                message:"User already exist. Please login to continue."
            })
        } 
        if(password.length < 5){
            return res.status(403).json({
                success:false,
                message:"Password length should be greater than or equal to 5."
            })
        }
        if(!email.endsWith('@gmail.com')){
            return res.status(403).json({
                success:false,
                message:"Email should be a Gmail account."
            })
        }
        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = await User.create({
            userName,email,password:hashedPassword
        })
        return res.status(200).json({
            success:true,
            message:"User created successfully.",
        })
    }
    catch(error){
        // console.log("Signup error: ",error.message)
        res.status(500).json({
            success:false,
            data:error.message,
            message:"User could not registered successfully. "
        })
    }
}

exports.login = async (req,res) => {
    try{
        const {email, password} = req.body;
        // console.log("Login attempt for:", email);

        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }

        const existingUser = await User.findOne({email});
        if(!existingUser){
            return res.status(400).json({
                success: false,
                message: "User is not registered. Please signup to continue."
            })
        }

        const isValidPassword = await bcrypt.compare(password, existingUser.password);
        if(!isValidPassword){
            return res.status(401).json({
                success: false,
                message: "Invalid password."
            })
        }

        const sessionId = crypto.randomUUID()
        SESSIONS.set(sessionId, existingUser)

        const token = jwt.sign(
            {
                id: existingUser._id,
                email,
                sessionId
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h",
            }
        );

        existingUser.password = undefined;

        const options = {
            expires: new Date(Date.now() + 3*24*60*60*1000),
            httpOnly: true,
            secure: true,
            sameSite:"none",
        }

        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            user: existingUser,
            message: "User logged in successfully.",
        })
    }
    catch(error){
        // console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "User could not login successfully."
        })
    }
}





