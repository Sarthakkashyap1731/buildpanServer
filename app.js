var createError = require('http-errors')
var express = require('express')
// const fileUpload = require('express-fileupload')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var bodyParser = require('body-parser')
const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })
const fileUpload = require('express-fileupload')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
const mongoose = require('mongoose')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var app = express()

app.use(
  fileUpload({
    createParentPath: true,
  })
)
// app.use(fileUpload())
// app.use('/uploads', express.static(path.join(__dirname, 'public')))

// app.use(express.static('uploads'))
// app.use('/static', express.static('public'))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
// app.use('/uploads', express.static('./uploads'))

app.use(express.urlencoded({ extended: true }))
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(express.json())
// app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'uploads')))
console.log('path.joinpath.join', path.join(__dirname, 'uploads'))

app.use('/', indexRouter)
app.use('/users', urlencodedParser, usersRouter)

async function main() {
  const uri =
    'mongodb+srv://buildpan:Sarthak317@cluster0.w0leq.mongodb.net/buildpan?retryWrites=true&w=majority'

  mongoose
    .connect(uri, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })

    .then((db) => console.log('db is connected'))
    .catch((err) => console.log(err))
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

main()

module.exports = app

//mongodb+srv://buildpan:Sarthak317@cluster0.w0leq.mongodb.net/buildpan?retryWrites=true&w=majority
//buildpan
//Sarthak317
