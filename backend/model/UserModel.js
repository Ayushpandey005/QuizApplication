import mongoose from "mongoose"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, required: true, enum: ["student", "teacher"]}
})

UserSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
    // const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, 10)
})

UserSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

UserSchema.methods.getJWTToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY,
        {expiresIn: process.env.JWT_EXPIRE}
    )
}

const UserModel = mongoose.model("User", UserSchema)

export default UserModel