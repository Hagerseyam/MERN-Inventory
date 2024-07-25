const User = require('../models/User');
const Note = require('../models/Note');
const asyncHandler = require('express-async-Handler');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


//desc get all users
//route get /users
//access private 

const getAllUsers = asyncHandler(async (req, res) => {
    //get all users from db and exclude password field using lean() method
    const users = await User.find().select('-password').lean();
    if(!users?.length){
        return res.status(400).json({message: 'No users found'})
    }
    res.json(users);
})

//desc create new users
//route post /users
//access private 
const createNewUser = asyncHandler(async (req, res) => {
     const{ username ,password ,roles} =req.body;

     //confirm data existence check
     if(!username || !password || !Array.isArray(roles)){
        return res.status(400).json({message: 'All field is required'})
     }

     //check if username already exists
     const duplicate = await User.findOne({username}).lean().exec();
     if(duplicate){
        //409 stands for conflict
         return res.status(409).json({message: 'Username already exists'})
     }
     //hash password
     const hashedPwd = await bcrypt.hash(password, 10); 
     const userObject ={username , "password": hashedPwd , roles}
     const user = await User.create(userObject)

    if(user){
        res.status(201).json({message: `New user ${username} created successfully`})
    }else{
        res.status(400).json({message: 'Failed to create user'})
    }
})






//desc update user 
//route patch /users
//access private 

const updateUser= asyncHandler(async (req, res) => {
    const { id,username, password, roles , active} = req.body;
    
    if(!id|| !username || !Array.isArray(roles) || !roles.length || typeof active !== "boolean"){

        return res.status(400).json({message: 'All field is required'})

    }

    const user =await User.findById(id).exec()

    if(!user){
        return res.status(400).json({message: 'User not found'})
    }

    const duplicate = await User.findOne({username}).lean().exec()
    //check if duplicate exists
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message: 'Username already exists'})
    }
    
    user.username = username
    user.roles = roles
    user.active = active

    if(password){
        //hash password
        user.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await user.save()
    res.json({message:`${updatedUser.username} updated`})
})




//desc delete user
//route delete /users
//access private 
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;
    
    if (!id) {
        return res.status(400).json({ message: 'Id is required' });
    }

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const username = user.username; // Capture username before deletion
    const deletedUserId = user._id; // Capture _id before deletion

    const notes = await Note.findOne({ user: id }).lean().exec();
    if (notes) {
        return res.status(400).json({ message: 'Cannot delete user. User has notes' });
    }

    const result = await user.deleteOne();

    if (result.deletedCount === 1) {
        const reply = `Username ${username} with ID ${deletedUserId} deleted`;
        return res.json({ message: reply });
    } else {
        return res.status(500).json({ message: 'Failed to delete user' });
    }
});



module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}