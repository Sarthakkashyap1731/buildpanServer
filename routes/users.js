var express = require('express')
var router = express.Router()
const shortid = require('shortid')

// import userModel from '../models/userModel'
const userModel = require('../models/userModel')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

router.post('/signUp', async (req, res) => {
  console.log('Inside signUp', req.body)
  try {
    let {
      profilePicture,
      userName,
      userScore,
      totalMatches,
      winMatches,
      looseMatches,
    } = req.body
    let userId = shortid.generate()
    console.log('userIduserIduserIduserId', userId)
    await userModel.create({
      userId: userId,
      profilePicture: profilePicture,
      userName: userName,
      userScore: userScore,
      totalMatches: totalMatches,
      winMatches: winMatches,
      looseMatches: looseMatches,
    })
    res.json({ success: true, message: 'SignUp successfully' })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
})

router.post('/loginUser', async (req, res) => {
  console.log('Inside loginUser')
  try {
    let { userName, userId } = req.body
    if (userName && userId) {
      let userData = await userModel.findOne({
        userName: userName,
        userId: userId,
      })
      res.json({
        success: true,
        message: 'User Login successfully',
        data: userData,
      })
    } else {
      res.json({
        success: false,
        message: 'No user found',
      })
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
})

router.get('/getUserList', async (req, res) => {
  console.log('Inside getUserList')
  try {
    let userData = await userModel.find().sort({ userScore: -1 })
    res.json({ success: true, message: 'User fetched', data: userData })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
})

module.exports = router
