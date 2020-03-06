const Menu = require('../models/Menu')
const Item=require('../models/Items')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc      Add course
// @route     POST /api/v1/menus/:menuId/items
// @access    Private
exports.createItem = asyncHandler(async (req, res, next) => {
    //get the user
    req.body.user = req.user.id;
    //get the menu
    menuid=req.params.menuId
    const menu = await Menu.findById("5e60f4181ec1988b2444066a");
    if (!menu) {
      return next(
        new ErrorResponse(
          `No Menu with the id of ${req.params.menuId}`,
          404
        )
      );
    }  
    req.body.menu=menu.id;
    const item = await Item.create(req.body);
    res.status(200).json({
      success: true,
      data: item
    });
  });

  // @desc    Get all items
// @route     GET /api/v1/items/
// @access    PUBLIC
exports.getItems = asyncHandler(async (req, res, next) => {
  res.json(
    res.advancedResults
);
});