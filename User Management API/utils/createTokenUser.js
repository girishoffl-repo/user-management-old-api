const createTokenUser = (user)=>{
    return {email : user.email, userId : user._id, phone : user.phone,fname : user.firstName}
}

module.exports = createTokenUser