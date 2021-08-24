var express = require('express')
var router = express.Router()
const shortid = require('shortid')
var multer = require('multer')
// var upload = multer({ dest: '/uploads/' })

// const upload = multer({ dest: 'uploads/' })
// const _ = require('lodash')

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
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let avatar = req.files.avatar
      let { userName, userId } = req.body

      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      avatar.mv('./uploads/' + avatar.name)
      // console.log('avataravataravatar', avatar)
      await userModel.updateOne(
        {
          userName,
          userId,
        },
        {
          profilePicture: `http://3.6.156.104:3080/${avatar.name}`,
        }
      )
      //send response
      res.send({
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
    res.status(500).send(err)
  }
})

module.exports = router
