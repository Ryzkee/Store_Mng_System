const mongoose = require("mongoose");

const CreditPersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  items: [{
    barcode: String,
    productName: String,
    qty: Number,
    price: Number,
  }],
  totalCredit: { type: Number, default: 0 },
  partialpayment: {type: Number,default: 0},
  dateLastCredited: { type: Date, default: Date.now },
  status: { type: String, default: "Unpaid" }, // paid, unpaid, overdue
  datePaid: { type: Date, default: null },
});

module.exports = mongoose.model("CreditPerson", CreditPersonSchema);