let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
app.use(flash())
app.use(session({
  secret: 'codingmojo',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))
app.use(bodyParser.urlencoded({ extended: true }))
let path = require('path')
app.use(express.static(path.join(__dirname, './static')))
app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'ejs')
mongoose.connect('mongodb://localhost/mongoose')
let MongooseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  detail: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now
  }
})
mongoose.Promise = global.Promise // this is creating the guidelines.
mongoose.model('Mongoose', MongooseSchema)
let Mongoose = mongoose.model('Mongoose')
app.get('/', (req, res) => {
  res.render('index')
})
app.get('/mongooses', (req, res) => {
  Mongoose.find({}, (err, x) => {
    console.log(x)
    if (err) {
      console.log('Error: ', err)
      return res.redirect('/')
    } else {
      res.render('mongooses', {mongoose: x})
    }
  })
})
app.post('/new', (req, res) => {
  let mongoose = new Mongoose(req.body)
  console.log(mongoose)
  mongoose.save(err => {
    if (err) {
      console.log('We have an error!', err)
      return res.redirect('/', {'errors': mongoose.errors})
    } else {
      return res.redirect('/mongooses')
    }
  })
})
app.get('/delete/:id', (req, res) => {
  Mongoose.remove({_id: req.params.id}, (err) => {
    if (err) {
      return res.render('/mongooses', {'errors': mongoose.errors})
    } else {
      return res.redirect('/mongooses')
    }
  })
})
app.post('/processedit/:id', (req, res) => {
  Mongoose.findOneAndUpdate({_id: req.params.id}, req.body, function (err, mongoose) {
  if (err) {
    return res.redirect('/edit', {'errors': Mongoose.errors})
  } else {
    return res.redirect('/mongooses')
  }
})
})
app.get('/edit/:id', (req, res) => {
  Mongoose.find({_id: req.params.id}, (err, mongoose) => {
    console.log(req.param.id)
    if (err) {
      // console.log('Error: ', err)
      return res.redirect('/edit')
    } else {
      console.log(mongoose)
      res.render('edit', x = mongoose[0])
    }
  })
})
app.listen(8000, () => {
  console.log('listening on port 8000')
})
