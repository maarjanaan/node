const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/excuses_db');
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

// BodyPARSE middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Home Route
app.get('/', function(req, res){
    Excuse.find({}, function(err, excuses){
        if(err){
            console.log(err);
        } else {
            res.render('index', {
                title: 'Vabandused',
                excuses: excuses
            });
        }
    });
});

// Add Route
app.get('/excuses/add', function(req, res){
    res.render('add_excuse', {
        title: 'Lisa uus vabandus'
    });
});

// Add Submit POST Route
app.post('/excuses/add', function(req, res){
    let excuse = new Excuse();
    excuse.title = req.body.title;
    excuse.author = req.body.author;
    excuse.body = req.body.body;

    excuse.save(function(err){
        if(err){
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    });
});

// Start server
app.listen(3000, function(){
    console.log('Server started on port 3000..');
});