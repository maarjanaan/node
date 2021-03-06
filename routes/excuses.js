const express = require('express');
const router = express.Router();

// Bring in Models
let Excuse = require('../models/excuse');
let User = require('../models/user');

//Excuses Route
router.get('/', function(req, res){
    Excuse.find({}, function(err, excuses){
        if(err){
            console.log(err);
        } else {
            res.render('excuses', {
                title: 'Vabandused',
                excuses: excuses
            });
        }
    });
});

// Add Route
router.get('/add', ensureAuthenticated, function(req, res){
    res.render('add_excuse', {
        title: 'Lisa uus vabandus'
    });
});

// Add Submit POST Route
router.post('/add', function(req, res){
    req.checkBody('title', 'Vabandus on kohustuslik').notEmpty();
    req.checkBody('body', 'Täpsustus on kohustuslik').notEmpty();

    // Get Errors
    let errors = req.validationErrors();

    if(errors){
        res.render('add_excuse', {
            title: 'Lisa uus vabandus',
            errors: errors
        });
    } else {
        let excuse = new Excuse();
        excuse.title = req.body.title;
        excuse.author = req.user._id;
        excuse.body = req.body.body;
        excuse.save(function(err){
            if(err){
                console.log(err);
                return;
            } else {
                req.flash('success', 'Vabandus lisatud');
                res.redirect('/excuses');
            }
        });
    }
});

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
    Excuse.findById({_id: req.params.id}, function(err, excuse){
        const isAuthorOwner = excuse.author.equals(req.user._id);
        if(!isAuthorOwner){
            req.flash('danger', 'See ei ole sinu vabandus ju!');
            res.redirect('/');
        }
        res.render('edit_excuse', {
            title: 'Muuda vabandust',
            excuse: excuse
        });
    });
});

// Update Submit POST Route
router.post('/edit/:id', function(req, res){
    let excuse = {};
    excuse.title = req.body.title;
    excuse.body = req.body.body;

    let query = {_id:req.params.id}

    Excuse.update(query, excuse, function(err){
        if(err){
            console.log(err);
            return;
        } else {
            req.flash('success', 'Vabandus muudetud');
            res.redirect('/excuses');
        }
    });
});

// Deleting
router.delete('/:id', function(req, res){
    if(!req.user._id){
        res.status(500).send();
    }
    let query = {_id:req.params.id}
     
    Excuse.findById({_id: req.params.id}, function(err, excuse){
        const isAuthorOwner = excuse.author.equals(req.user._id);
        if(!isAuthorOwner){
            res.status(500).send();
        } else {
            Excuse.remove(query, function(err){
                if(err){
                    console.log(err);
                }
                res.send('Success');
            });
        }
    });
});

// Get Single Excuse
router.get('/:id', function(req, res){
    Excuse
        .findById(req.params.id)
        .populate({ path: 'author', select: 'name' })
        .exec(function(err, excuse) {
            if (err) {
                return console.log(err);
            }
            const { author } = excuse;
            res.render('excuse', {
                excuse: excuse,
                author: author.name
            });
    });
});

// Access control
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('danger', 'Palun logi sisse');
        res.redirect('/users/login');
    }
}

module.exports = router;