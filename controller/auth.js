const User = require("../models/user") // to hasg the password.. this is used to encrypt the password..
const bcrpt = require("bcrypt")
const jwt = require("jsonwebtoken") // to create the jwt token.. this is used to create the token..
require('dotenv').config()


// steps for login and signup
//login-> get the email and password from the user
//check if (the data is valid) then the user exists..
//if the user exists then check if the password is correct
//if the password is correct then send the token to the user -> jwt token (process is in the login function how to create the token and send it to the user)
//if the password is incorrect then send the error message to the user
//if the user does not exist then send him/her to sign up page

//compare the password -> bcrypt.compare(password,hashedpassword) // read on web more


//jwt token creation through --> jwt.sign({data},secretkey,{expiresIn:time}) // read on web more

exports.login = async (req, res) => { //login function
    try {
        //get the email and password from the user
        const { email, password } = req.body

        //validation of email and password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "please provide email and password"
            })
        }

        //check if the user exists
        let user = await User.findOne({ email }).select("+password") // select the password as well.. as we have not selected the password in the schema.. so we have to select it here.. so that we can compare the password.. it is not compalsary but u can hehe

        //if the user does not exist
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        //verfiy password
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role
        }

        if (await bcrpt.compare(password, user.password)) {
            //if matched then login the user so first make a jwt token --> first take a instance of jwt (npm i jsonwebtoken)



            let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" }) // 1d means 1 day.. u can also use 1h for 1 hour.. u can also use 1m for 1 minute.. u can also use 1s for 1 second.. u can also use 1y for 1 year.. u can also use 1ms for 1 millisecond.. u can also use 1w for 1 week.. u can also use 1mo for 1 month
            user = user.toObject() // we need to convert to object to add token field in the user document.. as we can not add the field in the document directly.. so we have to convert it to object first..
            user.token = token
            user.password = undefined // ye object mai undefined kiy na ki database mai

            //cookie creation -> syntax .cookie(name , data,option(validity , expiresin , mention ki client side mai acces na ho ....))

            const option = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true // client side mai access na ho
            }

            res.cookie("token", token, option).status(200).json({
                success: true,
                token, user, message: "user looged  succes"
            }) // learn more



        } else {
            return res.status(403).json({
                success: false,
                message: "Invalid credentials"
            })
        }

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}

exports.signup = async (req, res) => {
    try {

        //get data from the user
        const { name, email, role, password } = req.body
        //check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                Message: "User already exists"
            })
        }

        //hash the password
        let hashedpassword;

        try {
            hashedpassword = await bcrpt.hash(password, 10)
        } catch (e) {
            return res.status(500).json({
                success: false,
                message: "nahi hua hash"
            })
        } // there are diff strategy to hash the password and some retry strategy.... 10 is the number of rounds.. the more the rounds the more secure the password is.. but it will take more time to hash the password.. so 10 is the optimal value..

        //user create 
        const newUser = await User.create({
            name, email, password: hashedpassword, role
        })


        return res.status(200).json({
            success: true,
            message: "user created successfully"
        })

    } catch (e) {
        console.log(e)
        return res.status(500).json({
            success: false,
            message: "pklz try again later"
        })
    }
}