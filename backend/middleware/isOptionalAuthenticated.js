import jwt from "jsonwebtoken";

const isOptionalAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            req.id = null;
            return next();
        }
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if (decode) {
            req.id = decode.userId;
        } else {
            req.id = null;
        }
        next();
    } catch (error) {
        req.id = null;
        next();
    }
};

export default isOptionalAuthenticated;
