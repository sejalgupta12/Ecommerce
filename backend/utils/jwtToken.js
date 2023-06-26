// creating token and saving in cookie

const getToken = (user,statusCode,res) => {
    const token = user.getJwtToken();
    const options = {
        expires : new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly : true
    }
    delete user._doc.password;
    res.status(statusCode).cookie("token",token,options).json({
        success : true,
        user,
        token
    });
};

module.exports = getToken;