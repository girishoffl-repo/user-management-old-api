const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')


const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,'Please provide email'],
        unique:true,
        validate:{
            validator:validator.isEmail,
            message :'please provide valid email'
        },
        immutable: true
    },
    firstName:{
        type:String,
        required:[true,'please provide first name'],
        minLength : 3,
        maxLength : 50
    },
    lastName:{
        type:String,
    },
    address:{
        type:String,
        required:[true,'please provide address'],
        minLength : 10,
        maxLength : 60
    },
    city:{
        type:String,
        required:[true,'please provide city name'],
        minLength : 3,
        maxLength : 20
    },
    state:{
        type:String,
        required:[true,'please provide state name'],
        minLength : 3,
        maxLength : 20
    },
    country:{
        type:String,
        required:[true,'please provide country name'],
        minLength : 3,
        maxLength : 20
    },
    phone:{
        type:String,
        required:[true,'please provide phone number'],
        minLength : 10,
        maxLength : 10,
        match: [/\d{10}/, "Number should only have digits"],
        trim:true
    },
    password : {
        type:String,
        required:[true,'please provide password'],
        minLength : 3,
        maxLength : 100
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
})

UserSchema.pre('save',async function(){
    if(!this.isModified('password')) {
        console.log('not modified');
        return};
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
    console.log('modified');
})
UserSchema.methods.comparePassword = async function(canditatePassword){
    console.log("compare method");
    const isMatch = await bcrypt.compare(canditatePassword,this.password)
    console.log(isMatch);
    return isMatch
}


module.exports = mongoose.model('User',UserSchema)