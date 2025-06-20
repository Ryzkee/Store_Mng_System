const mongoose = require('mongoose');

const Product = new mongoose.Schema({
  barcode: { type: String, required: true },
  productName: { type: String, required: true },
  investment: { type: Number, required: true },
  profit: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  stockQty: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  addtime: { type: Date, default: Date.now },
  updatetime: { type: Date, default: Date.now },
  status: { type: String, default: "available" }
})

module.exports = mongoose.model('product', Product, 'inventory');