const jwt = require('jsonwebtoken')

async function authMiddleware(req,res,next){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message:"unauthorized!"
        })
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({
            message:"unauthorized!"
        })
        }
         const user = decoded;
         req.user = user;

         next()

    } catch (error) {
         res.status(401).json({
            message:"unauthorized!"
        })
    }
}

module.exports = {authMiddleware}