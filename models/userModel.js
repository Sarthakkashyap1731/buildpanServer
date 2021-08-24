// import mongoose from 'mongoose'
const mongoose = require('mongoose')
const schema = mongoose.Schema

const userSchema = new schema(
  {
    profilePicture: { type: String, default: '' },
    userName: { type: String, default: '' },
    userId: { type: String, default: '' },
    userScore: { type: Number, default: 0 },
    totalMatches: { type: Number, default: 0 },
    winMatches: { type: Number, default: 0 },
    looseMatches: { type: Number, default: 0 },
    car: { type: Number, default: 1 },
    track: { type: Number, default: 1 },
    coins: { type: Number, default: 0 },
    createdDate: { type: Date, default: Date.now() },
    updatedDate: { type: Date, default: '' },
    isDeleted: { type: Boolean, default: false },
  },
  {
    versionKey: false,
  }
)

module.exports = mongoose.model('userSchema', userSchema)
