const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const cloudData = await cloudinary.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: cloudData.public_id,
      url: cloudData.secure_url,
    },
  });

  sendToken(user, 201, res);
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if email and password both have in req
  if (!email || !password) {
    return next(new ErrorHandler("Please enter Email & Password", 400));
  }

  let user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  sendToken(user, 200, res);
});

// Logout User

exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  let resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  // let resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = `Follow this link to reset your password :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Ecommerce Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} sucessfully.`,
    });
  } catch (error) {
    user.resetPasswordExpire = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

//Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  let resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  let user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    next(new ErrorHandler("Reset Password link has been expired", 400));
  }

  if (req.body.password != req.body.confirmPassword) {
    next(new ErrorHandler("Entered Password doesnot match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, res);
});

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

exports.updatePassword = catchAsyncError(async (req, res, next) => {
  let user = await User.findById(req.user.id).select("+password");

  let isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is incorrect"), 400);
  }

  if (req.body.newPassword != req.body.confirmPassword) {
    return next(new ErrorHandler("Password doesn't match"), 400);
  }

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});

exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const { name, email } = req.body;
  let updateData = {
    name,
    email,
  };

  if (req.body.avatar != "") {
    const user = await User.findById(req.user.id);
    await cloudinary.uploader.destroy(user.avatar.public_id);

    const cloudData = await cloudinary.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    updateData.avatar = {
      public_id: cloudData.public_id,
      url: cloudData.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, updateData, {
    new: true,
    useFindAndModify: false,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

//get all users -admin

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

// get single user - admin

exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`user doesnot exists with id: ${req.params.id}`),
      400
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// update profile - Admin

exports.updateUser = catchAsyncError(async (req, res, next) => {
  const { role, name, email } = req.body;
  let updateData = {
    role,
    name,
    email,
  };

  let user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User doesnot exist with id: ${req.params.id}`, 400)
    );
  }

  user = await User.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    useFindAndModify: false,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`user doesnot exist with id : ${req.params.id}`)
    );
  }
  await cloudinary.uploader.destroy(user.avatar.public_id);
  await user.deleteOne();
  res.status(200).json({
    success: true,
    message: "User deleted successfully.",
  });
});
