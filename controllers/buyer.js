const User=require('../models/Users');
const asyncHandler=require('../middleware/async');
const ErrorResponse=require('../utils/errorResponse')
//@desc        Get a Buyer
//@route       Get /api/v1/users
//@access      Public
exports.getBuyers =asyncHandler( async (req, res, next) => {
const users= await User.find();
console.log(users)
if(!users){
    return next(new ErrorResponse('Buyer is empty',404))
}
    res.status(201).json({
        success:true,
        data:users
    });

})

//@desc        Add a Buyer
//@route       POST /api/v1/users
//@access      Public
exports.addBuyer =asyncHandler( async (req, res, next) => {
    const user= await User.create(req.body);
    if(!user){
        return next(new ErrorResponse(`Error for creating Buyer`,404))
    }
    res.status(201).json({
        success:true,
        data:user
    });
    
    })

//@desc        Delete new User
//@route       DELETE /api/v1/users/:id
//@access      Private
exports.deleteBuyer = asyncHandler(async (req, res, next) => {
 
    const user=await User.findByIdAndDelete(req.params.id)   
    if(!user){
     return next(new ErrorResponse(`Buyer not found for id ${req.params.id}`,404))
    }
        res.status(200).json({success:true,count:user.length,data:user});
    
})