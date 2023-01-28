const bcrypt = require("bcryptjs");
const sendEmail = require("../util/email");
const userOTPVerification = require("../models/userOTPVerification");

const sendOTPVerificationEmail = async(_id, email, res) => {
    try {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
  
      const message = otp;
      const html = "<h2>Ecco il tuo OTP</h2> <h3> " + otp + "</h3>";
  
      bcrypt.hash(otp, 12).then((hashedOTP) => {
        const newOTPVerification = new userOTPVerification({
          userId: _id,
          otp: hashedOTP,
          createdAt: Date.now(),
          expireAt: Date.now() + 120000,
        });
        newOTPVerification.save();
        sendEmail(email, "Il tuo OTP!", html, message);
      });
    } catch (error) {  console.log(error) }
};

exports.OTPVerification = sendOTPVerificationEmail;