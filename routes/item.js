const express = require('express');
const {
   createItem,
   getItems
} = require('../controllers/item')
//Middelware
const {protect,authorize}=require('../middleware/auth.js')
const advanceResult=require('../middleware/advanceResult.js')
//Models
const Item=require('../models/Items')

const router = express.Router({mergeParams:true});

router.route('/')
    .get(advanceResult(Item,{
        path: 'menu',
        select: 'slug menu user'
      }),getItems)
router.route('/').post(protect,authorize('seller','superadmin'),createItem)

//router.route('/:distance/:zipcode').get(locateSeller)
module.exports = router;