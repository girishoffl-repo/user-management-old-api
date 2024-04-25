const {StatusCodes} = require('http-status-codes')
const constString = require('../utils/const')
const errorHandlerMiddleware = (err,req,res,next) =>{
    let customError = {
        statusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg : err.message || constString.SOMETHING_WENT_WRONG
    }

    if(err.name === 'ValidationError'){
        customError.msg = Object.values(err.errors).map((item)=>item.message).join(',')
        customError.statusCode = StatusCodes.FORBIDDEN
    }
    if(err.code && err.code === 11000){
        customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, choose another value`,
        customError.statusCode = StatusCodes.BAD_REQUEST;
    }
    if(err.name === 'CastError'){
        customError.msg = ` ${constString.ITEM_NOT_FOUND} ${err.value}`,
        customError.statusCode = StatusCodes.NOT_FOUND;
    }
    console.log(err);
    const resJson = {
        success:false,
        statusCode:customError.statusCode,
        errorMessage:customError.msg
    }
    return res.status(customError.statusCode).json(resJson)
}

module.exports = errorHandlerMiddleware