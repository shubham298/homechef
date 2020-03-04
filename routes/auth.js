const express = require('express');
const router = express.Router();

const {
register,
Login,
getMe
}=require('../controllers/auth')

const {protect,authorize}=require('../middleware/auth')
router.route('/register')
    .post(register)
router.route('/login')
    .post(Login)
router.route('/me')
    .get(protect,authorize('seller','buyer','superadmin'),getMe)

module.exports=router