const express = require('express');
const router = express.Router();
const Item=require('../models/Items')
const advanceResult=require('../middleware/advanceResult.js')
const {
   createItem,
   getItems
} = require('../controllers/item')

const {protect,authorize}=require('../middleware/auth.js')


router.route('/')
    .get(advanceResult(Item,'menus'),getItems)
    .post(protect,authorize('seller','superadmin'),createItem)
  

//router.route('/:distance/:zipcode').get(locateSeller)
module.exports = router;