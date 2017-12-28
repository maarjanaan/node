const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

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

// Start server
app.listen(3000, function(){
    console.log('Server started on port 3000..');
});