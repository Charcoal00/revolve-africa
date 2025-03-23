const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res
            .status(401)
            .json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decoded.userId }; // ✅ Extract userId from token
        next();
    } catch (error) {
        return res.status(403).json({ error: "Invalid or expired token." });
    }
};

module.exports = authenticateToken;
