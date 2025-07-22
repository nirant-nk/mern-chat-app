import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSideBar = async (req,res) => {
    try {
        const loggedInUserId = req.user._id;

        const filteredUSers = await User.find({_id:{$ne:loggedInUserId}}).select("-password");

        return res.status(200).json(filteredUSers)
    } catch (error) {
        return res.status(500).json({ 
             message: `Error at Get Users for Sidebar -> ${error.message}`
        })
    }
} 

export const getMessages = async (req,res) => {
    try {
        const {id:userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
        })

        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({ 
             message: `Error at Get Messages for Sidebar -> ${error.message}`
        })
    }
}

export const sendMessage = async (req,res) => {
    try {

        const {text} = req.body;
        const senderId = req.user._id;
        const { id:receiverId } = req.params;

        let imgUrl = "";
        if (req.file && req.file.path) {
            const uploaded = await cloudinaryV2.uploader.upload(req.file.path, {
                folder: "chat_imgs"
            });
            imgUrl = uploaded.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imgUrl
        })

        const sent = newMessage.save();

        // Todo: Relatime fucntionality here => socket.io

        if(!sent){
            return res.status(500).json({ 
                message: `Error: Unable to send message at the momment`
            })
        }

        return res.status(200).json(newMessage)

    } catch (error) {
        return res.status(500).json({ 
            message: `Error at send Message -> ${error.message}`
        })
    }
}