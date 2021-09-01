var express = require('express')
var router = express.Router()
const shortid = require('shortid')
var multer = require('multer')
var uniqid = require('uniqid')
var jwt = require('jsonwebtoken')
let config = require('../config/config')
const path = require('path')

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
      email,
      userScore,
      totalMatches,
      winMatches,
      looseMatches,
    } = req.body
    let userId = shortid.generate()
    let newUserName = userName + '-' + userId

    var result = ''
    var characters = '0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    console.log('resultresult ===', result)
    let newResult = userName + '_' + result
    let userData = await userModel.findOne({ email })
    // console.log('userDatauserData', userData)
    if (userData) {
      return res.json({
        success: false,
        message: 'User Already Exist. Please Login',
      })
    }
    let user = await userModel.create({
      userId: newResult,
      email: email,
      profilePicture: profilePicture,
      userName: userName,
      userScore: userScore,
      totalMatches: totalMatches,
      winMatches: winMatches,
      looseMatches: looseMatches,
    })
    console.log('useruser ====', user)
    //token

    // create a token
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400, // expires in 24 hours
    })
    console.log('token', token)
    res.json({ success: true, message: 'SignUp successfully', token: token })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
})

router.post('/search/user', async (req, res) => {
  console.log('Inside search user')
  try {
    let email = req.body.email
    let userData = await userModel.findOne({ email: email })
    console.log('userDatauserData', userData)
    // var token = req.headers.token
    // if (!token)
    //   return res
    //     .status(401)
    //     .send({ auth: false, message: 'No token provided.' })

    // jwt.verify(token, config.secret, function (err, decoded) {
    //   if (err)
    //     return res
    //       .status(500)
    //       .send({ auth: false, message: 'Failed to authenticate token.' })
    //   console.log('decodeddecodeddecoded', decoded)
    //   userData.findById(
    //     {
    //       _id: decoded.id,
    //     },
    //     // { password: 0 }, // projection
    //     function (err, user) {
    //       if (err)
    //         return res.status(500).send('There was a problem finding the user.')
    //       if (!user) return res.status(404).send('No user found.')

    //       // res.status(200).send(user); Comment this out!
    //       next(user) // add this line
    //     }
    //   )
    // })
    res.json({ success: true, message: 'User Fetched', data: userData })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
})

router.post('/loginUser', async (req, res) => {
  console.log('Inside loginUser')
  console.log('dirname', __dirname)
  try {
    let { userName, email } = req.body
    if (userName && email) {
      let userData = await userModel.findOne({
        userName: userName,
        email: email,
      })

      //req.header token
      // var token = req.headers['x-access-token']
      // var token = req.headers.token
      // if (!token)
      //   return res
      //     .status(401)
      //     .send({ auth: false, message: 'No token provided.' })

      // jwt.verify(token, config.secret, function (err, decoded) {
      //   if (err)
      //     return res
      //       .status(500)
      //       .send({ auth: false, message: 'Failed to authenticate token.' })
      //   console.log('decodeddecoded', decoded)
      //   // res.status(200).send(decoded)
      res.json({
        success: true,
        message: 'User Login successfully',
        data: userData,
        decoded: decoded,
      })
      // })
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

// router.post(
//   '/uploadProfilePicture',
//   upload.single('fileToImport'),
//   async (req, res) => {
//     console.log('uploadProfilePicture', req.file)
//     console.log('uploadProfilePicture', req.files)
//     console.log('Boddy === > ', req.body)
//     // let avatar = req.files.avatar

//     // //Use the mv() method to place the file in upload directory (i.e. "uploads")
//     // avatar.mv('./uploads/' + avatar.name)

//     // //send response
//     // res.send({
//     //   status: true,
//     //   message: 'File is uploaded',
//     //   data: {
//     //     name: avatar.name,
//     //     mimetype: avatar.mimetype,
//     //     size: avatar.size,
//     //   },
//     // })

//     // var busboy = new Busboy({ headers: req.headers })
//     // busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
//     //   console.log('File [' + fieldname + ']: filename: ' + filename)
//     //   file.on('data', function (data) {
//     //     console.log('File [' + fieldname + '] got ' + data.length + ' bytes')
//     //   })
//     //   file.on('end', function () {
//     //     console.log('File [' + fieldname + '] Finished')
//     //   })
//     // })
//     // busboy.on(
//     //   'field',
//     //   function (fieldname, val, fieldnameTruncated, valTruncated) {
//     //     console.log('Field [' + fieldname + ']: value: ' + inspect(val))
//     //   }
//     // )
//     // busboy.on('finish', function () {
//     //   console.log('Done parsing form!')
//     //   res.writeHead(303, { Connection: 'close', Location: '/' })
//     //   res.end()
//     // })
//     // req.pipe(busboy)

//     try {
//       if (
//         req.files &&
//         Object.keys(req.files).length != 0 &&
//         req.files.fileToImport
//       ) {
//         let fileToImport = req.files.fileToImport
//         let fileName = fileToImport.name
//         console.log('fileNamefileName', fileName)
//         let extension = fileName.split('.').pop()
//         console.log('extensionextension', extension)
//         let imageName = fileName + 'user' + extension
//         console.log('imageNameimageName', imageName)
//         let filePath = __basedir.uploadPath + imageName
//         console.log('filePathfilePath', filePath)
//         await fileToImport.mv(filePath)
//         res.json({ success: true, message: 'Profile Picture Uploaded' })
//       } else {
//         res.json({ success: false, message: 'Please upload file' })
//       }
//     } catch (err) {
//       res.status(500).json({
//         success: false,
//         message: err.message,
//       })
//     }
//   }
// )

// router.post('/single', upload.single('profile'), (req, res) => {
//   try {
//     // console.log('Inside Single', req)
//     res.send(req.body)
//     res.json({ success: true, msg: 'uploaded' })
//   } catch (err) {
//     res.send(400)
//   }
// })

router.post('/upload-avatar', async (req, res) => {
  try {
    console.log(req.files)
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded',
      })
    } else {
      let avatar = req.files.avatar
      let { userName, userId } = req.body
      avatar.mv(path.join(__dirname, '../uploads', avatar.name), (err) => {
        console.log('err', err)
      })
      console.log('path', path.join(__dirname, '../uploads', avatar.name))
      // let imagePath = await avatar.mv(
      //   path.join(__dirname, 'uploads', avatar.name)
      // )
      // await userModel.updateOne(
      //   {
      //     userName,
      //     userId,
      //   },
      //   {
      //     // profilePicture: `http://localhost:3080/${avatar.name}`,
      //     profilePicture: `http://3.6.156.104:3080/${avatar.name}`,
      //   }
      // )
      res.json({
        status: true,
        message: 'File is uploaded',
        data: {
          name: avatar.name,
          mimetype: avatar.mimetype,
          size: avatar.size,
        },
      })
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
})

router.post('/singup/guest', async (req, res) => {
  console.log('Inside guest')
  try {
    var result = ''
    var characters = '0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    console.log('resultresult ===', result)
    let header = req.headers
    console.log(req.headers)
    let newResult = 'Guest' + '_' + result
    console.log('newResultnewResult ===', newResult)
    let userName = req.body.userName
    await userModel.create({
      userName: userName,
      userId: newResult,
    })
    res.json({ success: true, message: 'SignUp successfully', header: header })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
})

router.post('/updateCoins', async (req, res) => {
  console.log('Inside updateCoins')
  try {
    let { userName, userId, coins } = req.body
    await userModel.updateOne(
      {
        userName: userName,
        userId: userId,
      },
      {
        coins: coins,
      }
    )
    res.json({ success: true, message: 'Coins Updated' })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
})

router.post('/updateUserData', async (req, res) => {
  console.log('Inside update user')
  try {
    let { id, userScore, totalMatches, winMatches, looseMatches, car, track } =
      req.body
    let obj = {}
    if (userScore) {
      obj.userScore = req.body.userScore
    }
    if (totalMatches) {
      obj.totalMatches = req.body.totalMatches
    }
    if (winMatches) {
      obj.winMatches = req.body.winMatches
    }
    if (looseMatches) {
      obj.looseMatches = req.body.looseMatches
    }
    if (car) {
      obj.car = req.body.car
    }
    if (track) {
      obj.track = req.body.track
    }
    console.log(' obj====', obj)

    let data = await userModel.updateOne(
      {
        _id: id,
      },
      obj
    )
    res.json({ success: true, message: 'Updated successfully', data: data })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
})

module.exports = router
