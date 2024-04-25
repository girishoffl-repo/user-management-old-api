// require('dotenv').config()
const jwt = require('jsonwebtoken')
const customError = require('../config/errors')
const constString = require('../utils/const')

const authenticateUser = (req,res,next)=>{
    const authHeader = req.headers.authorization
    console.log(authHeader);
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        console.log("auth failed");
        throw new customError.UnauthenticatedError(constString.AUTH_FAILED)
    }
    const token = authHeader.split(' ')[1]
    console.log(token);
    try {
        const payload = jwt.verify(token,process.env.JWT_SECRET)
        console.log("payload");
        console.log(payload);
        req.user = payload
        next()
    } catch (error) {
        console.log("payload failed");
        throw new customError.UnauthenticatedError(constString.AUTH_FAILED)
    }   
}

module.exports = {authenticateUser}



























// const authenticateUser = async(req,res,next)=>{
//     const token = req.signedCookies.token
//     if(!token){
//         throw new customError.UnauthenticatedError('Authenticate Invalid')
//     }
//     try {
//         const {userId,email,fname,lastName,phone,address,city,country,state} = isTokenValid({token})
//     req.user ={email,fname,phone,userId}
//     next()
//     } catch (error) {
//         console.log(error);
//     }
// }

// const tokenAuthentication = async(req,res,next)=>{
//     const headers = req.headers.authorization
//     console.log(req.headers);
//     console.log("authtoken");
//     console.log(headers);
//     if(!headers){
//         throw new customError.UnauthenticatedError('Authenticate Invalid')
//     }
//     next()
// }


// module.exports = {authenticateUser,tokenAuthentication}