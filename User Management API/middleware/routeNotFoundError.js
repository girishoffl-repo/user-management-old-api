const { StatusCodes } = require('http-status-codes')
const constString = require('../utils/const')

const routeNotFound = (req, res) => {
    const resJson = {
        success:false,
        statusCode:StatusCodes.NOT_FOUND,
        message:constString.ROUTE_NOT_FOUND
    }
   
    res.status(StatusCodes.NOT_FOUND).json(resJson)
}
module.exports = routeNotFound