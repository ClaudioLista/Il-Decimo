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
    default: null,
  },
});

loginAttemptSchema.index( { "expireAt": 1 }, { "expireAfterSeconds": 0 } );

module.exports = mongoose.model("loginAttempt", loginAttemptSchema);
