const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const federateuserSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, ref: "User", 
    required: false 
  },
  provider: {
    type: String,
    required: false,
  },
  subject: {
    type: String,
    required: false,
  },
  passModified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("FederateUser", federateuserSchema);