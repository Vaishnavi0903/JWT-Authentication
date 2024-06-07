const jwt = require("jsonwebtoken");
const userdb = require("../models/userSchema");
const keysecret = "vaishnavisontakkepremsatpute0903";


// authenticating the user to redirect him to dashboard
const authenticate = async (req, res, next) => {
    try {

        const token = req.headers.authorization;
        const verifytoken = jwt.verify(token, keysecret);
        const rootuser = await userdb.findOne({ _id: verifytoken._id });

        if (!rootuser) {
            throw new Error("user not found");
        }

        req.token = token
        req.rootuser = rootuser
        req.userId = rootuser._id

        next();


    } catch (error) {
        //if the user is not authorized then the error is send
        res.status(401).json({ status: 401, message: "Unauthorized , no token provided" })
    }
}

module.exports = authenticate