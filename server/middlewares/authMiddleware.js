import jwt from 'jsonwebtoken'
import userModel from '../models/Users.js'  

let checkUserAuthenticity = async(req, res, next) => {

    let token
    const { authorization } = req.headers

    if(authorization && authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = authorization.split(' ')[1]

            // Verifying Token
            const {userID} = jwt.verify(token, process.env.JWT_Secret_Key)
            //console.log(userID) // only for development, remove it in production afterwards

            // Get user from token
            req.user = await userModel.findById(userID).select('-password')
            next()
            //console.log(req.user) // only for development, remove it in production afterwards

        } catch (error) {
            console.log(error)

            res.status(401).send({"status": "failed", "message": "Unauthorized user"})
        }
    }
    else if (!token) {
        res.status(401).send({"status": "failed", "message": "Unauthorized user, no token"})
    }
}

export default checkUserAuthenticity