const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

let User = require('../models/user');

router.get('/add', function(req, res){
    res.render('add_user');
});

router.post('/add', function(req, res){
    const name = req.body.name;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const passwordconfirm = req.body.passwordconfirm;

    req.checkBody('name', 'Nimi on kohustuslik').notEmpty();
    req.checkBody('username', 'Kasutajanimi on kohustuslik').notEmpty();
    req.checkBody('email', 'E-mail on kohustuslik').notEmpty();
    req.checkBody('email', 'E-mail pole õige').isEmail();
    req.checkBody('password', 'Parool on kohustuslik').notEmpty();
    req.checkBody('passwordconfirm', 'Paroolid pole ühesugused').equals(req.body.password);

    let errors = req.validationErrors();

    if(errors){
        res.render('add_user', {
            errors:errors
        });
    } else {
        let newUser = new User({
            name:name,
            email:email,
            username:username,
            password:password
        });

        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(newUser.password, salt, function(err, hash){
                if(err) {
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function(err){
                    if(err){
                        console.log(err);
                        return;
                    } else {
                        req.flash('success', 'Oled kasutajaks registreerunud. Logi sisse');
                        res.redirect('/users/login');
                    }
                });
            });
        });
    }
});

router.get('/login', function(req, res){
    res.render('login');
});

module.exports = router;