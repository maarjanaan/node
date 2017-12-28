const express = require('express');
const router = express.Router();

// Bring in Models
let Excuse = require('../models/excuse');

// Add Route
router.get('/add', function(req, res){
    res.render('add_excuse', {
        title: 'Lisa uus vabandus'
    });
});

// Add Submit POST Route
router.post('/add', function(req, res){
    req.checkBody('title', 'Pealkiri on kohustuslik').notEmpty();
    req.checkBody('author', 'Autor on kohustuslik').notEmpty();
    req.checkBody('body', 'Sisu on kohustuslik').notEmpty();

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
        excuse.author = req.body.author;
        excuse.body = req.body.body;
        
        excuse.save(function(err){
            if(err){
                console.log(err);
                return;
            } else {
                req.flash('success', 'Artikkel lisatud');
                res.redirect('/');
            }
        });
    }
});

// Load Edit Form
router.get('/edit/:id', function(req, res){
    Excuse.findById(req.params.id, function(err, excuse){
        res.render('edit_excuse', {
            title: 'Muuda vabandust',
            excuse: excuse
        });
    })
});

// Update Submit POST Route
router.post('/edit/:id', function(req, res){
    let excuse = {};
    excuse.title = req.body.title;
    excuse.author = req.body.author;
    excuse.body = req.body.body;

    let query = {_id:req.params.id}

    Excuse.update(query, excuse, function(err){
        if(err){
            console.log(err);
            return;
        } else {
            req.flash('success', 'Artikkel muudetud');
            res.redirect('/');
        }
    });
});

// Deleting
router.delete('/:id', function(req, res){
    let query = {_id:req.params.id}

    Excuse.remove(query, function(err){
        if(err){
            console.log(err);
        }
        res.send('Success');
    });
})

// Get Single Excuse
router.get('/excuse/:id', function(req, res){
    Excuse.findById(req.params.id, function(err, excuse){
        res.render('excuse', {
            excuse: excuse
        });
    })
});

module.exports = router;