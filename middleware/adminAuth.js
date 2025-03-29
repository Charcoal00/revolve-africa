const jwt = require("jsonwebtoken");

module.exports = function adminToken(req, res, next) {
    const token = req.header("Authorization");

    if (!token) {
        return res
            .status(401)
            .json({ msg: "Access Denied. No token provided." });
    }

    try {
        const verified = jwt.verify(
            token.split(" ")[1],
            process.env.JWT_SECRET
        );
        req.admin = verified;
        next();
    } catch (err) {
        res.status(400).json({ msg: "Invalid Token" });
    }
};
