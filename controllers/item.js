const Menu = require('../models/Menu')
const Item=require('../models/Items')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')

// @desc      CREATE A ITEM
// @route     POST /api/v1/menus/:menuId/items
// @access    Private
exports.createItem = asyncHandler(async (req, res, next) => {

    req.body.menu=req.params.menuId
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