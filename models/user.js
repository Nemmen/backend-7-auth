const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim:true
    },
    email: {
        type: String,
        required: true,
        trim:true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim:true
    },
    role:{
        type:String , 
        enum:["Admin","Student","Visitor"] // enum is used to restrict the value of role to only these three values
    }
 })

 module.exports = mongoose.model("User",userSchema)