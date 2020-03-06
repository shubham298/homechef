const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse')
const Users=require('../models/Users')
//@desc        Get all information
//@route       Get /api/v1/superAdmin
//@access      Public
exports.getBuyers = asyncHandler(async (req, res, next) => {
    
    res.json(
        res.advancedResults
    );

})


//@desc        Delete a role
//@route       DELETE /api/v1/superAdmin/:id
//@access      Public
exports.deleteRole = asyncHandler(async (req, res, next) => {
let person=await Users.findByIdAndDelete(req.params.id);
if(!person){
    next(new ErrorResponse("Id is not deleted",500))
}
res.status(200).json({
    success:true,
    data:person
})
})