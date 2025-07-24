import bcryptjs from "bcryptjs";
import { defaultProfilePic } from '../constants.js';
import User from '../models/user.model.js';
import { attachCookies, removeCookies } from "../services/cookies.js";
import { createToken } from "../services/token.js";

export const signup = async (req,res) => {
    try {
        const {fullName,email,password,profilePic} = req.body;

        if(!email || !fullName || !password){
            res.status(400).json({
                message: "Bad Request: Neccesary marked fields are required"
            })
        }

        const existingUser = await User.findOne({email});

        if(existingUser){
            res.status(403).json({
                message: "Forbidden: User already exist."
            })
        }
        const saltRound =  await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password,saltRound);

        const newUser = new User({
            email,
            fullName,
            password:hashedPassword,
            profilePic: profilePic? profilePic : defaultProfilePic
        })

        const user = await newUser.save();

        if(!user){
            res.status(500).json({
                message: "ISE: User creation failed"
            })
        }

        return res.status(201).json({
            payload:{
                email: user.email,
                fullName: user.fullName,
            },
            message: "User Created Succesfully"
        })

    } catch (error) {
       res.status(500).json({
            message: "Error at Signup -> "+error
       }) 
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: Invalid credentials" });
        }

        const isPasswordMatch = await user.matchPassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Unauthorized: Invalid credentials" });
        }

        const payload = {
            _id: user._id,
            email: user.email
        };

        // Generate Access Token
        const accessToken = createToken(payload,process.env.JWT_ACCESS_SECRET,process.env.JWT_ACCESS_EXPIRY); 

        // Generate Refresh Token
        const refreshToken = createToken(payload,process.env.JWT_REFRESH_SECRET,process.env.JWT_REFRESH_EXPIRY);

        attachCookies(res, accessToken, refreshToken);

        return res.status(200).json({
            payload: {
                accessToken,
                refreshToken,
                user: {
                    id: user._id,
                    email: user.email,
                    fullName: user.fullName
                }
            },
            message: "Login successful"
        });

    } catch (error) {
        return res.status(500).json({
            message: `Error at Login -> ${error.message}`
        });
    }
};

export const logout = async (_, res) => {
    try {
        // Clear access token cookie
        removeCookies(res);
        console.log("here try");
        
        return res.status(200).json({
            message: "Logout successful, cookies cleared"
        });

    } catch (error) {
        console.log("here catch");
        return res.status(500).json({
            message: `Error at Logout -> ${error.message}`
        });
    }
};

export const checkAuth = async(req,res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
         return res.status(500).json({
            message: `Error at Login -> ${error.message}`
        });
    }
}