const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

mongoose.connect(config.database);
let db = mongoose.connection;

// Check connection
db.once('open', function(){
    console.log('Connected to MongoDB');
})

// Check for DB errors
db.on('error', function(err){
    console.log(err);
});

// App
const app = express();

// Bring in Models
let Excuse = require('./models/excuse');

// Load View Engine Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// BodyPARSE Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

// Passport
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
});

// Home Route
app.get('/', function(req, res){
    Excuse.find({}, function(err, excuses){
        if(err){
            console.log(err);
        } else {
            let randomExcuse = parseInt(Math.random() * excuses.length);
            res.render('index', {
                title: 'Vabandused',
                excuses: excuses,
                randomExcuse: excuses[randomExcuse].title
            });
        }
    });
});

// Route Files
let excuses = require('./routes/excuses');
app.use('/excuses', excuses);

let users = require('./routes/users');
app.use('/users', users);

// Start server
app.listen(3000, function(){
    console.log('Server started on port 3000..');
});