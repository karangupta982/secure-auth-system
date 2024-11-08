const express = require("express")
const router = express.Router();

const { auth } = require("../Middleware/Auth") 
const { login, signup } = require("../Controller/Auth");

router.post("/signup",signup);
router.post("/login",login);


module.exports = router;