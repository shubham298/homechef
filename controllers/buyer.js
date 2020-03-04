const Buyer=require('../models/Buyer');
const asyncHandler=require('../middleware/async');
const ErrorResponse=require('../utils/errorResponse')
//@desc        Get a Buyer
//@route       Get /api/v1/users
//@access      Public
exports.getBuyers =asyncHandler( async (req, res, next) => {
const buyers= await Buyer.find();
if(!buyers){
    return next(new ErrorResponse('Buyer is empty',404))
}
    res.status(201).json({
        success:true,
        data:buyers
    });

})

//@desc        Add a Buyer
//@route       POST /api/v1/users
//@access      Public
exports.addBuyer =asyncHandler( async (req, res, next) => {
    req.body.user=req.user
    const buyer= await Buyer.create(req.body);
    if(!buyer){
        return next(new ErrorResponse(`Error for creating Buyer`,404))
    }
    res.status(201).json({
        success:true,
        data:buyer
    });
    
    })

//@desc        Delete new User
//@route       DELETE /api/v1/users/:id
//@access      Private
exports.deleteBuyer = asyncHandler(async (req, res, next) => {
 
    const buyer=await Buyer.findByIdAndDelete(req.params.id)   
    if(!buyer){
     return next(new ErrorResponse(`Buyer not found for id ${req.params.id}`,404))
    }
        res.status(200).json({success:true,count:buyer.length,data:buyer});
    
})