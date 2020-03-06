const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema(
  [{
  name: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title']
  },
  type: {
    type: String,
    enum: ['veg','nonveg'],
    required: [true, 'Please add a type']
  },
  price: {
    type: Number,
    default: false
  },
  menu: {
    type: mongoose.Schema.ObjectId,
    ref: 'Menu',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
}]);

// Static method to get save of course tuitions
ItemSchema.statics.getTotalCost = async function(menuId) {
  const obj = await this.aggregate([
    {
      $match: { menu: menuId }
    },
    {
      $group: {
        _id: '$menu',
        totalCost: { $sum: '$price' }
      }
    }
  ]);
  console.log(obj)

  try {
    await this.model('Menu').findByIdAndUpdate(menuId, {
      totalCost: Math.ceil(obj[0].totalCost / 10) * 10
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getTotalCost after save
ItemSchema.post('save', function() {
  this.constructor.getTotalCost(this.menu);
});

// Call getTotalCost before remove
ItemSchema.pre('remove', function() {
  this.constructor.getTotalCost(this.menu);
});

module.exports = mongoose.model('Items', ItemSchema);