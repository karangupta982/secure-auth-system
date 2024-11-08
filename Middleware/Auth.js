const {SESSIONS} = require('../index')
const jwt = require('jsonwebtoken')
require("dotenv").config();

exports.auth = async (req,res,next) =>{
    try{

        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Please login to access this resource"
            })
        }
        try{
            const decoded = await jwt.verify(token,process.env.JWT_SECRET);
            req.user = decoded;

            const sessionId = decoded.sessionId;
            const existingUser = SESSIONS.get(sessionId)

            if(existingUser == null){
                return res.status(401).json({
                    success:false,
                    message:"SessionId is wrong."
                })
            } 
        }
        catch(err){
            return res.status(401).json({
                success:false,
                message:"Invalid token"
            })
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Something Went Wrong While Validating Token."
        })
    }
}