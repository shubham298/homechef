const express = require('express');
const {
    getAllmenus,
    getMenu,
    updateMenu,
    deleteMenu,
    createMenu,
    sellerMenu
} = require('../controllers/menu')
//Importing middleware
const {protect,authorize}=require('../middleware/auth.js')
const advanceResult=require('../middleware/advanceResult.js')

//Models
const Menu=require('../models/Menu')

//Defining router
const router = express.Router({mergeParams:true});

//importing other resource router
const itemRouter=require('./item.js')

router.use('/:menuId/items', itemRouter)

router.route('/')
    .get(advanceResult(Menu,'items'),getAllmenus)
    .post(protect,authorize('seller','superadmin'),createMenu)

router.route('/:id')
    .get(getMenu)
    .put(protect,authorize('seller','superadmin'),updateMenu)
    .delete(protect,authorize('seller','superadmin'),deleteMenu)

router.route('/sellerMenu/:sellerId').get(sellerMenu)
//router.route('/:distance/:zipcode').get(locateSeller)
module.exports = router;