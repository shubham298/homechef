const Seller = require('../models/Seller')
const User = require('../models/Users')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
//@desc        Get all seller
//@route       Get /api/v1/sellers
//@access      Public
exports.getSellers = asyncHandler(async (req, res, next) => {

    const sellers = await Seller.find();
    if (!sellers) {
        return next(new ErrorResponse('Seller is empty', 404))
    }
    res.json(
        res.advancedResults
    );

})

//@desc        Get single seller
//@route       Get /api/v1/seller/:id
//@access      Public
exports.getSeller = asyncHandler(async (req, res, next) => {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
        return next(new ErrorResponse(`Seller not found for id ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true,
        data: seller
    });

})

//@desc        Create new seller
//@route       Post /api/v1/sellers
//@access      Private
exports.createSeller = asyncHandler(async (req, res, next) => {
    console.log(req.user.id)
    req.body.user = req.user.id

    console.log(`req body : ${JSON.stringify(req.body)}`)
    const seller = await Seller.create(req.body);
    if (!seller) {
        return next(new ErrorResponse(`Error for creating Seller`, 404))
    }
    res.status(201).json({
        success: true,
        data: seller
    });

})


//@desc        Update new seller
//@route       PUT /api/v1/sellers/:id
//@access      Private
exports.updateSeller = asyncHandler(async (req, res, next) => {

    const seller = await Seller.findByIdAndUpdate(req.params.id, req.body, {
        new: true, //res will have updated data
        runValidators: true //it will run mongoose validator
    })

    if (!seller) {
        return next(new ErrorResponse(`Seller not found with id ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true,
        data: seller
    });

})

//@desc        Delete new seller
//@route       DELETE /api/v1/sellers/:id
//@access      Private
exports.deleteSeller = asyncHandler(async (req, res, next) => {

    const seller = await Seller.findByIdAndDelete(req.params.id)
    if (!seller) {
        return next(new ErrorResponse(`Seller not found for id ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true,
        count: Seller.length,
        data: seller
    });

})

//@desc        Location seller
//@route       GET /api/v1/sellers/:distance/:zipcode
//@access      Private
exports.locateSeller = asyncHandler(async (req, res, next) => {


})