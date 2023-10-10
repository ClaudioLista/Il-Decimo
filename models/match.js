const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const matchSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  placeName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  totalPlayers: {
    type: Number,
    required: true,
  },
  currentPlayers: {
    type: Number,
    required: true,
  },
  listPlayers: {
    players: [
      {
        userId: { 
          type: Schema.Types.ObjectId, 
          ref: 'User', 
          required: true ,
        }
      }
    ]
  },
  votes: {
    angry: { type: Number, default: 0, required: false},
    sad: { type: Number, default: 0, required: false},
    ok: { type: Number, default: 0, required: false},
    good: { type: Number, default: 0, required: false},
    happy: { type: Number, default: 0, required: false},
  },
  hostUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

matchSchema.methods.addPlayer = function(user) {
  const updatedMatchPlayers = [...this.listPlayers.players];

  const result = updatedMatchPlayers.find(
    (element) => element.userId == user.toString()
  );
if (result) {
  
} else {
  updatedMatchPlayers.push({ userId: user });
  
  const updatedMatch = { players: updatedMatchPlayers };
  
  this.listPlayers = updatedMatch;
  this.currentPlayers = this.currentPlayers+1;
  return this.save();
}

  
};

matchSchema.methods.RemovePlayer = function(userId){

  const updatedMatchPlayers = this.listPlayers.players.filter(player => {
    return player.userId.toString() !== userId.toString();
  });

  this.listPlayers.players = updatedMatchPlayers;
  this.currentPlayers = this.currentPlayers-1;

  return this.save();
};

module.exports = mongoose.model('Match', matchSchema);