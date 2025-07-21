import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { attachCookies } from "./cookies.js";

export const createToken = (payload,secret,expiry) => jwt.sign(
    payload,
    secret,
    { expiresIn: expiry || '1d' }
);

export const refreshAccessToken = async (req, res) => {
    const token = req.cookies?.refreshToken;

    if (!token) {
        return res.status(401).json({ message: 'Refresh token missing. Unauthorized.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        // Optional: Verify the user still exists
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found.' });
        }

        const payload = {
            userId: user._id,
            email: user.email
        };

        const newAccessToken = createToken(payload,process.env.JWT_ACCESS_SECRET,process.env.JWT_ACCESS_EXPIRY); 

        // Optionally re-issue refresh token (optional for session renewal policies)
        attachCookies(res, newAccessToken, token);  // Reuse old refresh token

        return res.status(200).json({
            message: 'Access token refreshed',
            payload: {
                user: {
                    id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                    profilePic: user.profilePic
                }
            }
        });

    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired refresh token.' });
    }
};