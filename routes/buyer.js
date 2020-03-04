const express = require('express');
const router = express.Router();

const {
getBuyers,
addBuyer,
deleteBuyer
}=require('../controllers/buyer')

const {protect,authorize}=require('../middleware/auth.js')


router.route('/')
    .get(protect,authorize('buyer','superadmin'),getBuyers)
    .post(protect,authorize('buyer','superadmin'),addBuyer)

router.route('/:id').delete(protect,authorize('buyer','superadmin'),deleteBuyer)
module.exports=router