const express = require('express');
const validators = require('../middleware/validator.middleware');
const authController = require("../controllers/authController");
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// POST /auth/register
router.post('/register', validators.registerUserValidations, authController.registerUser);

// POST /auth/login
router.post('/login', validators.loginUserValidations, authController.loginUser);

//GET /auth/me
router.get('/me',authMiddleware, authController.getUserDetails)

//Post /auth/logout
router.get('/logout',authController.logoutUser)

//GET /auth/users/me/addresses
router.get('/users/me/addresses',authMiddleware,authController.getUserAddresses)

//POST /auth/users/me/addresses
router.post('/users/me/addresses',validators.addUserAddressValidations,authMiddleware,authController.addUserAddress)

//Delete /auth/users/me/addresses/:addressId
router.delete('/users/me/addresses/:addressId',authMiddleware,authController.deleteUserAddress)

module.exports = router;