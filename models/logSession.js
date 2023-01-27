const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const logSessionSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
      },
  time: {
    type: Date,
    required: true,
    default: Date.now()
  },
  ipAddress: { 
    type: String, 
    required: true
  },
});

module.exports = mongoose.model("logSession", logSessionSchema);
