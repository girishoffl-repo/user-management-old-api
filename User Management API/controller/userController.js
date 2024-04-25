const userService = require('../service/userService')
const { StatusCodes } = require('http-status-codes')
const { createJWT } = require('../utils/jwt')
const createTokenUser = require('../utils/createTokenUser')
const constString = require('../utils/const')

const createUser = async (req, res) => {
    const user = req.body
    const response = await userService.createUser(user)
    const resJson = {
        success: true, statusCode: StatusCodes.OK, message: "User successfully created", resultObject: response
    }
    res.status(StatusCodes.OK).json(resJson)
}

const loginUser = async (req, res) => {
    const loginParameters = req.body
    let userDetails = await userService.loginUser(loginParameters)
    const tokenUser = createTokenUser(userDetails)
    console.log(tokenUser);
    const generatedToken = createJWT(tokenUser)
    userDetails.token = generatedToken
    const userWithToken = userDetails
    const resJson = {
        success: true, statusCode: StatusCodes.OK, message: "Login successful", resultObject: userWithToken
    }
    res.status(StatusCodes.OK).json(resJson)
}

const updateUser = async (req, res) => {
    const updateParameters = req.body
    console.log(req.user);
    const { id } = req.params
    const { _id, email, firstName, lastName, phone, address, city, country, state } = await userService.updateUser(updateParameters, id)
    const resJson = { success: true, statusCode: StatusCodes.OK, message: "Updated successful", resultObject: { _id, email, firstName, lastName, phone, address, city, country, state } }
    res.status(StatusCodes.OK).json(resJson)

}

const softDelete = async (req, res) => {
    const { id } = req.body
    console.log(req.user);
    const { _id, email, firstName, lastName, phone, address, city, country, state } = await userService.softDelete(id)
    console.log(`id match ${id === req.user.userId}`);
    const resJson = { success: true, statusCode: StatusCodes.OK, message: "Deleted successful", resultObject: { _id, email, firstName, lastName, phone, address, city, country, state } }
    res.status(StatusCodes.OK).json(resJson)
}

const pagination = async (req, res) => {
    const { page } = req.body
    const usersList = await userService.pagination(page)
    const resJson = { success: true, statusCode: StatusCodes.OK, message: `Users on page ${page}`, resultObject: { usersList } }
    res.status(StatusCodes.OK).json(resJson)

}


const changePassword = async (req, res) => {
    const { id, oldPassword, newPassword, isForget } = req.body
    console.log(id, oldPassword, newPassword, isForget);
    if (isForget) {
        if (id && newPassword) {
            console.log(`if log ${isForget}`);
            const result = await userService.changePassword({ id, newPassword, isForget });
            console.log("result");
            console.log(result);
            const resJson = { success: true, statusCode: StatusCodes.OK, message: result }
            return res.status(StatusCodes.OK).json(resJson)
        }
        const resJson = { success: false, statusCode: StatusCodes.FORBIDDEN, message: `${(id || (id && newPassword)) ? constString.PROVIDE_NEW_PASSWORD : constString.PROVIDE_ID}` }
        return res.status(StatusCodes.FORBIDDEN).json(resJson)
    }
    const checkPasswordChangeParams = (function () {

        if (id || oldPassword) {
            if (oldPassword && newPassword) {
                if (id && oldPassword && newPassword) {
                    return
                } else {
                    return constString.PROVIDE_ID  
                }
            } else {
                if (!newPassword && !oldPassword) {
                    return constString.PROVIDE_OLD_NEW_PASSWORD
                }
                if (!oldPassword) {
                    return constString.PROVIDE_OLD_PASSWORD
                }
                if (oldPassword && !id) {
                    return constString.PROVIDE_ID_NEW_PASSWORD
                }
                if (oldPassword) {
                    return constString.PROVIDE_NEW_PASSWORD
                }
            }
        } else {
            if (!newPassword) {
                return constString.PROVIDE_ID_OLD_NEW_PASSWORD
            }
            return constString.PROVIDE_ID_OLD_PASSWORD
        }
    })()
    if (!checkPasswordChangeParams) {

        const result = await userService.changePassword({ id, newPassword, oldPassword, isForget });
        console.log("final");
        console.log(result);
        const resJson = { success: true, statusCode: StatusCodes.OK, message: result }
        return res.status(StatusCodes.OK).json(resJson)
    }
    const resJson = { success: false, statusCode: StatusCodes.FORBIDDEN, message: checkPasswordChangeParams }
    res.status(StatusCodes.FORBIDDEN).json(resJson)
}

module.exports = { createUser, loginUser, updateUser, pagination, softDelete, changePassword }