const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const loghttpSchema = new Schema({
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

const LogHttp = mongoose.model("Loghttp", loghttpSchema);

module.exports = LogHttp;
