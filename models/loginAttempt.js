const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const loginAttemptSchema = new Schema({
  usrName: {
    type: String,
  },
  createdAt: { 
    type: Date, 
    expires: "15m",
    default: Date.now 
  },
});

//loginAttemptSchema.index( { "expireAt": 1 }, { expireAfterSeconds: 0 } );

module.exports = mongoose.model("loginAttempt", loginAttemptSchema);
