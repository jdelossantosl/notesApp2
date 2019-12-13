const express = require ('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/User');

router.get('/users/signin', (req,res) => {
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/users/signup', (req,res) => {
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
    const {name, email, password, confirmpassword} = req.body;
    const errors = [];
    if (name.length <= 0) {
        errors.push({text: 'El nombre es necesario.'});
    }
    if (password != confirmpassword) {
        errors.push({text: 'Las contraseñas no coinciden.'});
    }
    if (password.length < 4) {
        errors.push({text: 'La contraseña debe tener al menos 4 carácteres.'});
    }
    if (errors.length > 0) {
        res.render('users/signup', {errors, name, email, password, confirmpassword});
    } else {
        const emailUser = await User.findOne({email: email});
        if (emailUser) {
            req.flash('error_msg', 'El email ya está en uso');
            res.redirect('/users/signup');
        }
        const newUser = new User({name, email, password});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'Registro con éxito.');
        res.redirect('/users/signin');
    }
});

router.get('/users/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

module.exports = router;