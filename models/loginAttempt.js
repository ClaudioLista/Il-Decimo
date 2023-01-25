const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const loginAttemptSchema = new Schema({
  usrName: {
    type: String,
  },
  attempts: {
    type: Number,
    default: 0
  },
  expireAt: { 
    type: Date, 
    default: Date.now 
  },
});

loginAttemptSchema.index( { "expireAt": 1 }, { "expireAfterSeconds": 3600 } );

module.exports = mongoose.model("loginAttempt", loginAttemptSchema);
