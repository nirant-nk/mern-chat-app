import bcryptjs from "bcryptjs";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        email:{
            type: String,
            required: true,
            unique: true,
        },
        fullName:{
            type: String,
            required: true,
        },
        password:{
            type: String,
            required: true,
        },
        profilePic:{
            type:String,
            default:"",
        }
    },
    {
        timestamps: true,
    }
);

UserSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    try {
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcryptjs.compare(enteredPassword, this.password);
};

const User = mongoose.model("User",UserSchema);

export default User;