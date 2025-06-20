const mongoose = require("mongoose");

const OrderListSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  items: [
    {
      barcode: String,
      productName: String,
      qty: Number,
      price: Number,
    },
  ],
  totalPrice: Number,
  orderDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("OrderList", OrderListSchema);
