import User from "../models/user.model.js";
import cloudinaryV2 from "../services/cloudinary.js";

export const updateProfile = async (req,res)=>{
    try {
        const id = req.user._id;

        const user = await User.findById(id)

        if(!user){
            return res.status(404).json({message:"No user found"})
        }

        const {fullName,email} = req.body;

        if(email && email !== user.email){
            const emailExist = await User.findOne({email});

            if(emailExist){
                return res.status(409).json({message:"Email already in use"})
            }
            user.email = email;
        }

        if(fullName) user.fullName = fullName;

        if (req.file && req.file.path) {
            const uploaded = await cloudinaryV2.uploader.upload(req.file.path, {
                folder: "profile_pics"
            });
            user.profilePic = uploaded.secure_url;
        }


        const userCreated = await user.save();

        if(!userCreated){
            return res.status(500).json({message:"User Creation Failed"})
        }
        
        return res.status(200).json({
            message: "Updated Profile Successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: `Error at updateProfile -> ${error.message}`
        });
    }
}