// auth , isStuden , isAdmin --> middleware to check authenticity and authorization of the user

//authorization will be checked by taking the role from the jwt token to know if isstudent or isAdmin


const jwt = require("jsonwebtoken")
require("dotenv").config()


exports.auth = async(req,res,next) => { //middleware to check the authenticity of the user via jwt token it has 3 parameter req,res,next , next means to pass the control to the next middleware or route handler
    try{
        //extract the token ... from req body , from the cookie or from the header..
        const token = req.body.token  || req.cookies.token // first check in the body then in the header then in the cookie --> in header this the particular syntax need to lern more on  net styntax -- > || req.headers.authorization.split(" ")[1]...
        //giving error on split function serach
        if(!token){
            res.status(401).json({
                status:false,
                message:"unauthorized access"
            })
        }
        
        //verify the token using verify method from jwt ...
        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET)
            console.log(decode)

            req.user= decode // we are adding the user to the request object so that we can use it in the next middleware or route handler

        }catch(e){
            console.log(e)
            return res.status(401).json({
                success:false,
                message:"token is invalid"
            })
        }

        next()

    }catch(e){
      
        return res.status(500).json({
            success:false,
            message:"internal server error"
        })
    }

    
}


exports.isStudent = async(req,res,next) => {

    try{
        console.log(req.user)
        if(req.user.role !== "Student"){
            res.status(401).json({
                success:false,
                role: req.user.role,
                message:"this is for student stay away"
            })
        }
        next()
    }catch(e){
        console.log(e)
        res.status(401).json({
            success:false,
            message:"internal server error"
        })
    }
}


exports.isAdmin = async(req,res,next) => {
    
    try{
        if (req.user.role !== "Admin") {
            return res.status(401).json({
                success: false,
                role: req.user.role,
                message: "This is for admins only."
            });
        }
        next();
    }catch(e){
        console.log(e)
        res.status(401).json({
            success:false,
            message:"internal server error"
        })
    }
}