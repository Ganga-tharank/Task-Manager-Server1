import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
// const jwt = require('jsonwebtoken');

// const protect = expressAsyncHandler(async (req, res, next) => {
//     let token;

//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         // Extract the token from the Authorization header
//         token = req.headers.authorization.split(' ')[1];

//         try {
//             // Verify the token
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);

//             // Find the user associated with the token (assuming Mongoose User model)
//             const user = await User.findById(decoded.id).select('-password');

//             if (!user) {
//                 res.status(401);
//                 throw new Error('User not found');
//             }

//             // Attach the user object to the request for further processing
//             req.user = user;
//             next(); // Proceed to the next middleware
//         } catch (error) {
//             console.error(error.message);
//             res.status(401);
//             throw new Error('Not authorized to access this route');
//         }
//     } else {
//         // No token provided in the Authorization header
//         res.status(401);
//         throw new Error('Not authorized, no token');
//     }
// });




const protect = expressAsyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error('Not authorized to access this route');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
})

export { protect }