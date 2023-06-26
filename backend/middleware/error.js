const ErrorHandler = require("../utils/errorhandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // mongodb cast error
    if(err.name === "CastError"){
        console.log("err==========",err)
        const message = `${err.message}`
        err = new ErrorHandler(message,400)
    }

    // mongoose duplicate error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErrorHandler(message,400)
    }

    // wrong jsonwebtoken error
    if(err.name === "jsonWebTokenError"){
        const message = `Json Web Token is Invalid, try again`
        err = new ErrorHandler(message,400)
    }

    // Jwt token error
    if(err.name === "TokenExpiredError"){
        const message = `Json Web Token is Expired, try again`
        err = new ErrorHandler(message,400)
    }

    res.status(err.statusCode).json({
        success : false,
        message : err.message
    })
}