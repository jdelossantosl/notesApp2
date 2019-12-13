const express = require ('express');
const router = express.Router();
const {isAuthenticated} = require('../helpers/auth');

const Note = require ('../models/Note');

router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/newnotes')
});

router.post('/notes/newnotes', isAuthenticated, async (req, res) => {
    const {title, description} = req.body;
    const errors = [];
    if (!title) {
        errors.push({text:'Hay que insertar título'});
    }
    if (!description) {
        errors.push({text:'Hay que insertar descripción'});
    }
    if (errors.length > 0) {
        res.render('notes/newnotes', {
            errors,
            title,
            description
        });
    }
    else {
        const newNote = new Note({title, description});
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('success_msg', 'La nota se añadió correctamente');
        res.redirect('/notes');
        }
});

router.get('/notes', isAuthenticated, async (req, res) => {
    const notes = await Note.find({user: req.user.id}).sort({date: 'desc'});
    res.render('notes/allnotes', {notes});    
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    const note = await Note.findById(req.params.id);
    res.render('notes/editnotes', {note});
});

router.put('/notes/editnotes/:id', isAuthenticated, async (req, res) => {
    const {title, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title, description});
    req.flash('success_msg', 'Nota actualizada correctamente.');
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Nota borrada correctamente.');
    res.redirect('/notes');
});

module.exports = router;