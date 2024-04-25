const User = require('../model/user')
const customError = require('../config/errors/index')
const constString = require('../utils/const')

const createUser = async(user)=>{
    const isEmailAlreadyExists = await User.findOne({ email:user.email })
    if (isEmailAlreadyExists ) {
        throw new customError.BadRequestError(constString.EMAIL_ALREADY_EXISTS)
    }
    const  {_id,email,firstName,lastName,phone,address,city,country,state} = await User.create(user)
    return  {_id,email,firstName,lastName,phone,address,city,country,state} 
}

const loginUser = async(loginParams)=>{
    const isUserAlreadyExists  = await User.findOne({email:loginParams.email})  
    if(isUserAlreadyExists && !isUserAlreadyExists.isDeleted){
        const isMatch = await isUserAlreadyExists.comparePassword(loginParams.password)
        if(isMatch){
                const {_id,email,firstName,lastName,phone,address,city,country,state} = isUserAlreadyExists
            return {_id,email,firstName,lastName,phone,address,city,country,state} 
        }
        throw new customError.UnauthenticatedError(constString.WRONG_PASSWORD)
    }
    throw new customError.UnauthenticatedError(constString.AUTH_FAILED)
}

const updateUser = async(updateParams,id)=>{
    const  {firstName,lastName,phone,address,city,country,state} = updateParams
    const user = await User.findOne({_id:id}).select('-password')
    console.log(user);
    if(!user || user.isDeleted){
        throw new customError.NotFoundError(`${constString.ITEM_NOT_FOUND} ${id}`)
    }
    if(firstName){
        user.firstName = firstName
    }
    if(lastName){
        user.lastName = lastName
    }
    if(phone){
        user.phone = phone
    }
    if(address){
        user.address = address
    }
    if(city){
        user.city = city
    }
    if(country){
        user.country = country
    }
    if(state){
        user.state = state
    }
    console.log("after update");
    console.log(user);
    await user.save()
    return  user 
}

const softDelete = async(id)=>{
    const user = await User.findOne({_id:id})
    if(!user || user.isDeleted){
        throw new customError.NotFoundError(`${constString.ITEM_NOT_FOUND} ${id}`)
    }
    user.isDeleted = true;
    await user.save()
    console.log("delete");  
    return user
}


const pagination = async(page)=>{
    console.log(page);
    const pageNo = Number(page) || 1
    const limit =  5
    const skip = (pageNo-1)*limit
    let usersList = await User.find({isDeleted:false}).skip(skip).limit(limit).select('-isDeleted -password')
    return usersList
}

const changePassword = async(changePasswordParams)=>{
    console.log(changePasswordParams);
   const {id,newPassword, oldPassword,isForget} = changePasswordParams
    if(isForget){
        const result = await User.findOne({_id : id})
        console.log(result);
        if(!result || result.isDeleted){
            throw new customError.NotFoundError(`${constString.ITEM_NOT_FOUND} ${id}`)
        }
        result.password = newPassword
        await result.save()

        console.log(result.password);
        return constString.PASSSWORD_CHANGED_SUCCESS
    }
    const result = await User.findOne({_id : id})
    if(!result){
        throw new customError.NotFoundError(`${constString.ITEM_NOT_FOUND} ${id}`)
    }
    console.log(`check ${await result.comparePassword(oldPassword)}`);
    if(await result.comparePassword(oldPassword)){
            result.password = newPassword
            await result.save()
            console.log(result.password);
        return constString.PASSSWORD_CHANGED_SUCCESS
        }
        throw new customError.UnauthenticatedError(constString.OLD_PASSWORD_WRONG)
   
}

module.exports = {createUser,loginUser,updateUser,pagination,softDelete,changePassword}