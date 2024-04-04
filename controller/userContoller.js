const catchAsyncErorr = require("../middleware/catchAsyncErorr");

const userModel = require("../model/userModel");
const ErrorHandler = require("../utils/errorHandler");
const sendJwt = require("../utils/sendJwt");

// signUp
exports.signUp = catchAsyncErorr(async (req, res, next) => {
  const newAcc = await userModel.create(req.body);
  sendJwt(newAcc, res, "Account is crated successfully", 201, req);
});


// loged in
exports.login = catchAsyncErorr(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter your email or password", 400));
  }
  const user = await userModel.findOne({ email }).select("+password");
  console.log(user);
  if (!user) {
    return next(new ErrorHandler("User does not exist", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Wrong Password", 404));
  }
  console.log(user);

  sendJwt(user, res, "LogeIn Successfully", 200, req);
});



// log out
exports.logOut = catchAsyncErorr(async(req, res, next) => {
  res
    .clearCookie("token", {
      expire: new Date(Date.now() - 1000),
      httpOnly: true,
    })
    .json({
      msg: "logout successfully",
      logOut: true,
    });
});

// getallusers

exports.getAllUser = catchAsyncErorr(async(req, res, next) => {

    const users = await userModel.find({});

    res.status(200).json({
      users
    })
   
});
