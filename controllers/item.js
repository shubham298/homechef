const Menu = require('../models/Menu')
const Item = require('../models/Items')
const path = require('path')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Users = require('../models/Users')

// @desc      CREATE A ITEM
// @route     POST /api/v1/menus/:menuId/items
// @access    Private
exports.createItem = asyncHandler(async (req, res, next) => {

  //?storing menuid and userid in req.body 
  req.body.menu = req.params.menuId;
  req.body.user = req.user.id;
  let menu = await Menu.findById(req.params.menuId);

  if (!menu) {
    return next(
      new ErrorResponse(
        `No Menu with the id of ${req.params.menuId}`,
        404
      )
    );
  }

  const item = await Item.create(req.body);
  res.status(200).json({
    success: true,
    data: item
  });
});

// @desc    GET all items
// @route     GET /api/v1/items/
// @access    PUBLIC
exports.getItems = asyncHandler(async (req, res, next) => {
  res.json(
    res.advancedResults
  );
});


// @desc    GET all items for a particular selerid
// @route     GET /api/v1/seller/:id/items
// @access    PUBLIC
exports.getSellerItems = asyncHandler(async (req, res, next) => {
  
  Item.find({user: {$in:req.params.id}}, function (err, sellerItems) {
    if(err){
      return next(new ErrorResponse(`items not found for sellerid ${req.params.id}`, 404));
    }else{
      res.json(
        sellerItems
      )
    }
  });
  
});

//@desc        Get single item based on itemid
//@route       Get /api/v1/items/:id
//@access      Public
exports.getItem = asyncHandler(async (req, res, next) => {

  const item = await Item.findById(req.params.id);
  if (!item) {
    return next(new ErrorResponse(`Item not found for id ${req.params.id}`, 404))
  }
  res.status(200).json({
    success: true,
    data: item
  });

})

//@desc        Update new item
//@route       PUT /api/v1/items/:id
//@access      Private
exports.updateItem = asyncHandler(async (req, res, next) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //res will have updated data
    runValidators: true //it will run mongoose validator
  })
  if (!item) {
    return next(new ErrorResponse(`Item not found with id ${req.params.id}`, 404))
  }
  if (item.user.toString() !== req.user.id && req.user.role !== "seller") {
    next(new ErrorResponse(`${req.user.name} is not autorised to update this seller of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: item
  });

})

//@desc        Delete a menu
//@route       DELETE /api/v1/sellers/:id
//@access      Private
exports.deleteItem = asyncHandler(async (req, res, next) => {

  const item = await Item.findByIdAndDelete(req.params.id)
  if (!item) {
    return next(new ErrorResponse(`Item not found for id ${req.params.id}`, 404))
  }
  //validate
  if (item.user.toString() !== req.user.id && req.user.role !== "seller") {
    next(new ErrorResponse(`${req.user.name} is not autorised to update this seller of ${req.params.id}`, 404));
  }
  res.status(200).json({
    success: true,
    count: item.length,
    data: item
  });

})



// @desc      Upload photo for item
// @route     PUT /api/v1/items/:id/photo
// @access    Private
exports.itemPhotoUpload = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    return next(
      new ErrorResponse(`Item not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is seller 
  if (item.user.toString() !== req.user.id && req.user.role !== 'seller' ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this seller`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  const file = req.files.file;
  
  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${item._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH_ITEM}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Item.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name
    });
  });
});