const express = require('express');
const router = express.Router({mergeParams:true});
const Menu=require('../models/Menu')
const Users=require('../models/Users')
const advanceResult=require('../middleware/advanceResult.js')
const {
    getAllmenus,getMenu,updateMenu,deleteMenu,createMenu
} = require('../controllers/menu')

const {protect,authorize}=require('../middleware/auth.js')

//import other routes
 const itemroute=require('./item')
router.use('/:menuId/items', itemroute)

router.route('/')
    .get(advanceResult(Menu,'items'),getAllmenus)
    .post(protect,authorize('seller','superadmin'),createMenu)

router.route('/:id')
    .get(getMenu)
    .put(protect,authorize('seller','superadmin'),updateMenu)
    .delete(protect,authorize('seller','superadmin'),deleteMenu)
//router.route('/:distance/:zipcode').get(locateSeller)
module.exports = router;