import express from 'express';
const router = express.Router()

import checkUserAuthenticity from '../middlewares/authMiddleware.js';
import register from '../controllers/userControllers/register.js';
import login from '../controllers/userControllers/login.js';
import profileDetailOfLoggedUser from '../controllers/userControllers/profileDetail.js';
import updatePassword from '../controllers/userControllers/updatePasswordUC.js';
import forgetPassword from '../controllers/userControllers/forgetPasswordUC.js';

// Route Level Middlware - to protect route
router.use('/updatePassword', checkUserAuthenticity)
router.use('/profileDetailOfLoggedUser', checkUserAuthenticity)

// // Public Route
router.post('/register', register)
router.post('/login', login)
router.post('/sendUserPassResetEmail', forgetPassword.sendUserPassResetEmail)
router.post('/userPassReset/:id/:token', forgetPassword.userPassReset)

// // Protected (Private) Route
router.post('/updatePassword', updatePassword)
router.get('/profileDetailOfLoggedUser', profileDetailOfLoggedUser)

export default router