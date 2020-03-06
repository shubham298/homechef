const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');
const geopip=require('geoip-lite')

const MenuSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'Please add a category'],
      trim: true,
      maxlength: [50, 'category can not be more than 50 characters']
    },
    slug: String,
    description: {
      type: String,
      // required: [true, 'Please add a description'],
      maxlength: [500, 'Description can not be more than 500 characters']
    },
    totalCost: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'Users',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create bootcamp slug from the name
MenuSchema.pre('save', function(next) {
  this.slug = slugify(this.category, { lower: true });
  next();
});



// Cascade delete courses when a bootcamp is deleted
MenuSchema.pre('remove', async function(next) {
  console.log(`Items being removed from bootcamp ${this._id}`);
  await this.model('Items').deleteMany({ menu: this._id });
  next();
});

// Reverse populate with virtuals
MenuSchema.virtual('items', {
  ref: 'Items',
  localField: '_id',
  foreignField: 'menu',
  justOne: false
});

module.exports = mongoose.model('Menu', MenuSchema);
