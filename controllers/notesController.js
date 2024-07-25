const Note = require('../models/Note');
const asyncHandler = require('express-async-Handler');
const mongoose = require('mongoose');
const User = require('../models/User');

//desc get all notes
//route get /notes
//access private 
const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().lean();
    if (!notes?.length) {
        return res.status(400).json({ message: 'No notes found' });
    }
    res.json(notes);
});

//desc create new note
//route post /notes
//access private 
const createNewNote = asyncHandler(async (req, res) => {
    const { title, text, user } = req.body;

    if (!title || !text || !user) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Find the user by username
    const userDoc = await User.findOne({ username: user }).exec();
    if (!userDoc) {
        return res.status(400).json({ message: 'User not found' });
    }

    const noteObject = { title, text, user: userDoc._id };
    const note = await Note.create(noteObject);

    if (note) {
        res.status(201).json({ message: `New note created successfully` });
    } else {
        res.status(400).json({ message: 'Failed to create note' });
    }
});

//desc update note 
//route patch /notes
//access private 
const updateNote = asyncHandler(async (req, res) => {
    const { id, title, text, user } = req.body;

    if (!id || !title || !text || !user) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const note = await Note.findById(id).exec();

    if (!note) {
        return res.status(400).json({ message: 'Note not found' });
    }

    note.title = title;
    note.text = text;
    note.user = user;

    const updatedNote = await note.save();
    res.json({ message: `Note ${updatedNote._id} updated` });
});

//desc delete note
//route delete /notes
//access private 
const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Id is required' });
    }

    const note = await Note.findById(id).exec();

    if (!note) {
        return res.status(404).json({ message: 'Note not found' });
    }

    const result = await note.deleteOne();

    if (result.deletedCount === 1) {
        const reply = `Note with ID ${id} deleted`;
        return res.json({ message: reply });
    } else {
        return res.status(500).json({ message: 'Failed to delete note' });
    }
});

module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
};
