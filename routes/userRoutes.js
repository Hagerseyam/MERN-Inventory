const express = require('express');
const router = express.Router();
const path = require('path');
const usersController = require('../controllers/usersController');


// Routes for user operations
router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.createNewUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser);

module.exports = router;
