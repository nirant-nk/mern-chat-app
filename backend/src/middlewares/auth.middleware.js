import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = (req, res, next) => {
    const token = req.cookies?.accessToken;

    if (!token) {
        return res.status(401).json({ message: 'Access token missing. Unauthorized.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        const user = User.findById(decoded._id).select("-password")
        if(!user) return res.status(404)

        req.user = user;  // decoded {_id,email}
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired access token.' });
    }
};