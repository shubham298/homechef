const User = require('../models/Users');
const crypto = require('crypto')
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse')
const sendEmail = require('../utils/sendEmail')
//@desc        Register a User
//@route       POST /api/v1/auth/register
//@access      Public
exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  if (!user) {
    return next(new ErrorResponse(`Error for creating User`, 404))
  }
  sendTokenResponse(user, 200, res);
})

//@desc        Login a User
//@route       POST /api/v1/auth/login
//@access      Private
exports.Login = asyncHandler(async (req, res, next) => {
  const {
    email,
    password
  } = req.body;

  // // Validate emil & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({
    email
  }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  sendTokenResponse(user, 200, res);

})


// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});


// @desc      User Forgot password
// @route     POST /api/v1/auth/forgotPassword
// @access    PUBLIC
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email
  });

  if (!user) {
    return next(new ErrorResponse('No User with that Email ', 404));
  }
  //Get Reset Token
  let resetToken = user.getResetPasswordToken()
  console.log(resetToken)

  await user.save({
    validateBeforeSave: false
  })
  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetPassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    });
    res.status(200).json({
      success: true,
      data: 'Email sent'
    });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({
      validateBeforeSave: false
    });
    return next(new ErrorResponse('Email could not be sent', 500));
  }

});


//@desc        Reset a User
//@route       POST /api/v1/auth/resetPassword
//@access      Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
  .createHash('sha256')
  .update(req.params.resettoken)
  .digest('hex');

const user = await User.findOne({
  resetPasswordToken,
  resetPasswordExpire: { $gt: Date.now() }
});

if (!user) {
  return next(new ErrorResponse('Invalid token', 400));
}

// Set new password
user.password = req.body.password;
user.resetPasswordToken = undefined;
user.resetPasswordExpire = undefined;
await user.save();

sendTokenResponse(user, 200, res);
})

// Get token from model, create cookie and send response

const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken(); //getSignedJwtToken is created using methods not static so it will be call on user instance not User

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true; //It will be send through HTTPS
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};