import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: String,
    value: Number,
  }, {timestamps: true});


mongoose.model('Product', ProductSchema);