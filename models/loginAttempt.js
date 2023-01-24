const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const loginAttemptSchema = new Schema({
  usrName: {
    type: String,
  },
  expireAt: { 
    type: Date, 
    default: Date.now 
  },
});

loginAttemptSchema.index( { "expireAt": 1 }, { "expireAfterSeconds": 120 } );

module.exports = mongoose.model("loginAttempt", loginAttemptSchema);
