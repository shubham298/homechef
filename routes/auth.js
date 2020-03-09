const express = require('express');
const router = express.Router();

const {
register,
Login,
getMe,
resetPassword,
forgotPassword
}=require('../controllers/auth')

const {protect,authorize}=require('../middleware/auth')
router.route('/register')
    .post(register)
router.route('/login')
    .post(Login)
router.route('/me').get(protect,authorize('seller','superadmin','buyer'),getMe)
router.route('/forgotPassword').post(forgotPassword)
router.route('/resetPassword/:resettoken').put(resetPassword)

module.exports=router