const mongoose = require('mongoose')

const Schema = mongoose.Schema

const chatRoomSchema = new Schema({
  matchId: {
    type: String,
    ref: 'Match',
    required: true
  },
  chat: {
    message: [
      {
        name: {
          type: String,
          required: false,
        },
        msg: {
          type: String,
          required: false,
        },
        date: {
          type: String,
          required: false,
        }
      }
    ]
  }
})

chatRoomSchema.methods.addMessage = function (message) {
  const updatedMessage = [...this.chat.message]

  updatedMessage.push({
    name: message.name,
    msg: message.message,
    date: message.date
  })

  const updatedChat = { message: updatedMessage }

  this.chat = updatedChat

  return this.save()
}

module.exports = mongoose.model('ChatRoom', chatRoomSchema)
