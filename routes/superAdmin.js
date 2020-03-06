const express = require('express');
const router = express.Router();
const advanceResult = require('../middleware/advanceResult.js')
const User = require('../models/Users')
const {
    getBuyers,
    deleteRole
} = require('../controllers/superAdmin')

const {
    protect,
    authorize
} = require('../middleware/auth.js')


router.route('/')
    .get(advanceResult(User), protect, authorize('superadmin'), getBuyers)
router.route('/:id')
    .delete(protect, authorize('superadmin'), deleteRole)

module.exports = router