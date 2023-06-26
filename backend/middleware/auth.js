const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.isAuthenticatedUser = catchAsyncError(async(req,res,next) => {
    const { token } = req.cookies;
    if(!token){
        next(new ErrorHandler("Please login to access this resource",401));
    }

    let decodedData = jwt.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
});

exports.authorizeRole = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role : ${req.user.role} is not alloweed to access this resource`,403));
        }
        next();
    }
};


