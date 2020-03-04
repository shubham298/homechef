const express = require('express');
const router = express.Router();
const Seller=require('../models/Seller')
const advanceResult=require('../middleware/advanceResult.js')
const {
    getSellers,
    getSeller,
    createSeller,
    deleteSeller,
    updateSeller,
    locateSeller
} = require('../controllers/seller')

const {protect,authorize}=require('../middleware/auth.js')


router.route('/')
    .get(advanceResult(Seller),getSellers)
    .post(protect,authorize('seller','superadmin'),createSeller)

router.route('/:id')
    .get(getSeller)
    .put(protect,authorize('seller','superadmin'),updateSeller)
    .delete(protect,authorize('seller','superadmin'),deleteSeller)
router.route('/:distance/:zipcode').get(locateSeller)
module.exports = router;