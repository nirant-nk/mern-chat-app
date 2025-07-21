import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
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

const Message = mongoose.model("Message",MessageSchema);

export default Message;