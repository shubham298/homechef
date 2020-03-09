const Menu = require('../models/Menu')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
//@desc        Get all menu
//@route       Get /api/v1/menu
//@access      Public
exports.getAllmenus = asyncHandler(async (req, res, next) => {
    res.json(
        res.advancedResults
    );
})

//@desc        Get single menu based on menuid
//@route       Get /api/v1/menu/:id
//@access      Public
exports.getMenu = asyncHandler(async (req, res, next) => {
    
    const menu = await Menu.findById(req.params.id);
    if (!menu) {
        return next(new ErrorResponse(`Menu not found for id ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true,
        data: menu
    });

})

//@desc        Get single menu based on sellerid
//@route       Get /api/v1/menus/sellerMenu/:sellerId
//@access      Public
exports.sellerMenu = asyncHandler(async (req, res, next) => {
    
    const seller = await Menu.findOne({user:req.params.sellerId});
    if (!seller) {
        return next(new ErrorResponse(`Seller not found for id ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: seller
    });

})

//@desc        Create new menu
//@route       Post /api/v1/menu
//@access      PRIVATE
exports.createMenu = asyncHandler(async (req, res, next) => {
    console.log(req.user.id)
    req.body.user = req.user.id
    const count=await Menu.findOne({user:req.user.id})
    if(count){
        return next(new ErrorResponse('You can only add one menu per seller'))
    }
    const menu = await Menu.create(req.body);

    if (!menu) {
        return next(new ErrorResponse(`Error for creating Menu`, 404))
    }
    res.status(201).json({
        success: true,
        data: menu
    });

})


//@desc        Update new seller
//@route       PUT /api/v1/sellers/:id
//@access      Private
exports.updateMenu = asyncHandler(async (req, res, next) => {
    const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
        new: true, //res will have updated data
        runValidators: true //it will run mongoose validator
    })
    if (menu.user.toString() !== req.user.id && req.user.role!=="seller") {
        next(new ErrorResponse(`${req.user.name} is not autorised to update this seller of ${req.params.id}`, 404));
    }

    if (!menu) {
        return next(new ErrorResponse(`Menu not found with id ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true,
        data: menu
    });

})

//@desc        Delete a menu
//@route       DELETE /api/v1/sellers/:id
//@access      Private
exports.deleteMenu = asyncHandler(async (req, res, next) => {

    const menu = await Menu.findByIdAndDelete(req.params.id)
    if (!menu) {
        return next(new ErrorResponse(`Menu not found for id ${req.params.id}`, 404))
    }
    //validate
    if (menu.user.toString() !== req.user.id && req.user.role!=="seller") {
        next(new ErrorResponse(`${req.user.name} is not autorised to update this seller of ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        count: menu.length,
        data: menu
    });

})

//@desc        Location seller
//@route       GET /api/v1/sellers/:distance/:zipcode
//@access      Private
exports.locateSeller = asyncHandler(async (req, res, next) => {

})