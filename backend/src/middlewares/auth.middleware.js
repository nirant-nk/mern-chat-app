import jwt from "jsonwebtoken";

export const protectRoute = (req, res, next) => {
    const token = req.cookies?.accessToken;

    if (!token) {
        return res.status(401).json({ message: 'Access token missing. Unauthorized.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        // const user = User.findById(decoded.userId).select("-password")
        // if(!user) return res.status(404)

        // increases database calls
        req.user = decoded;  // decoded {_id,email}
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired access token.' });
    }
};