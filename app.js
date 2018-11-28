var express  = require('express')
var path = require ('path')
var mongoose = require('mongoose')
var config = require('./config/database')
var bodyParser = require('body-parser')
var session  = require('express-session')
var expressValidator = require('express-validator')
var pages = require('./routes/pages')
var adminPages = require('./routes/adminPages')


//connect to db
mongoose.connect(config.database);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connect to MongooDB')
});

//init app
var app = express()

//parse application/x-www-form middleware
app.use(bodyParser.urlencoded({extended : false}))
//parsse application JSON
app.use(bodyParser.json())

//express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))

//Express messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//expressValidator
app.use(expressValidator())

//view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//set public folder
app.use(express.static(path.join(__dirname, 'public')))

//set global errors variable
app.locals.errors = null

//set router
app.use('/', pages)
app.use('/admin/pages', adminPages)



//start  server
var port = 5000
app.listen(port, () => {
    console.log('server listening ' + port)
})


