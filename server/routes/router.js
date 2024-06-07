// creating API for login and signup

const express = require("express");          //importing express
const router = new express.Router();
const userdb = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");

// for user registration data to store in database (API for registration page)
router.post("/register", async (req, res) => {

    // below line is the data we obtain from the frontend into the request body
    const { fname, email, password, cpassword } = req.body;         // object destructuring


    // if any data is missing it will throw and error
    if (!fname || !email || !password || !cpassword) {
        res.status(422).json({ error: "fill all the details" });
    }
    try {
        //if email already exist in the database
        const preuser = await userdb.findOne({ email: email });      //findOne({dbemail : i/pemail})

        if (preuser) {
            res.status(422).json({ error: "This Email Already Exist" });
        } else if (password !== cpassword) {
            res.status(422).json({ error: "Password and Confirm Password doesnot match" });
        } else {

            // storing data in database 
            const finalUser = new userdb({
                fname, email, password, cpassword
            });

            // here password hashing
            const storeData = await finalUser.save();

            res.status(201).json({ status: 201, storeData });
        }
    } catch (error) {
        res.status(422).json(error);
        console.log("catch block error");
    }
});


// for user login (API for login page)
router.post("/login", async (req, res) => {

    // below line is the data we obtain from the frontend into the request body
    const { email, password } = req.body;         // object destructuring


    // if any data is missing it will throw and error
    if (!email || !password) {
        res.status(422).json({ error: "fill all the details" });
    }

    try {
        //verify the user if he is present in database
        const userValid = await userdb.findOne({ email: email })      //dbemail:i/pemail

        if (userValid) {

            //compare the passwords entered by user and stored in database
            let isMatch = await bcrypt.compare(password, userValid.password);

            if (!isMatch) {
                res.status(422).json({ error: "password incorrect" });
            } else {
                // generate token for authentication
                //generateAuthtoken() function is defined in userSchema
                const token = await userValid.generateAuthtoken();

                //generate cookie
                res.cookie("usercookie", token, {
                    expires: new Date(Date.now() + 9000000),
                    httpOnly: true
                });

                const result = {
                    userValid,
                    token
                }

                res.status(201).json({ status: 201, result });
            }
        }
    } catch (error) {
        res.status(401).json(error);
    }

});


// validating user to dashboard : in authenticate.js as well as below code
router.get("/validuser", authenticate, async (req, res) => {
    try {
        const validUserOne = await userdb.findOne({ _id: req.userId })  // dbId:Id from authenticate.js
        res.status(201).json({ status: 201, validUserOne });

    } catch (error) {
        res.status(401).json({ status: 401, error });
    }
})


// user logout
router.get("/logout" , authenticate , async(req,res) => {
    console.log("In router.js");
    try {
        res.rootUser.tokens = res.rootUser.tokens.filter((curelem) => {
            return curelem.token !== req.token
        });

        res.clearCookie("usercookie" , {path:"/"});

        req.rootUser.save();

        res.status(201).json({status:201});

    } catch (error) {
        res.status(401).json({status:401 , error});

    }
})


module.exports = router;
