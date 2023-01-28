const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserOTPVerificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  otp: {
    type: String,
  },
  createdAt: { 
    type: Date, 
    default: Date.now(),
  },
  expireAt: { 
    type: Date, 
    default: null,
  },
});

UserOTPVerificationSchema.index( { "expireAt": 1 }, { "expireAfterSeconds": 0 } );

const UserOTPVerification = mongoose.model("userOTPVerification", UserOTPVerificationSchema);

module.exports = UserOTPVerification;