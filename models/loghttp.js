const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const loghttpSchema = new Schema({
  time: {
    type: Date,
    default: Date.now()
  },
  username: {
    type: String,
    default:null,
  },
  httpVersion: {
    type: String,
  },
  method: {
    type: String,
  },
  url: {
    type: String,
  },
  remoteAddress: {
    type: String,
  },
});

module.exports = mongoose.model("Loghttp", loghttpSchema);
