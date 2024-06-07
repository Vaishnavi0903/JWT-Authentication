// Defining schema of our database table - users


const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const keysecret = "vaishnavisontakkepremsatpute0903";

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,           //users with same email should not register twice
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("not valid email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    cpassword: {
        type: String,
        required: true,
        minlength: 8
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});

// hash password
//before calling save method of mongodb we are going to hash the password

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);

    }

    next()
});


// token generate
userSchema.methods.generateAuthtoken = async function () {

    try {
        let token = jwt.sign({ _id: this._id }, keysecret, {
            expiresIn: "1d"
        });

        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (error) {
        res.status(422).json(error);
    }
}


//creating model/collection
const userdb = new mongoose.model("users", userSchema);



module.exports = userdb;