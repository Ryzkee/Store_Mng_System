const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const Username = require("./schema/username.js");
const Product = require("./schema/addProdSchema.js");
const OrderList = require("./schema/orderlist.js");
const CreditPerson = require("./schema/credit_person.js");
const bcrypt = require("bcrypt");

//import routes
const authRoute = require("./routes/auth.js");

const app = express();
app.use(express.json());
app.use(cors());

//connect to MongoDB
async function connectDB() {
  try {
    await mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
      });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectDB();

async function createInitialUser() {
  const username = "dazStore";
  const existing = await Username.findOne({ username });
  if (!existing) {
    const hashedPassword = await bcrypt.hash("mel0915", 10);
    const newUser = new Username({
      username,
      password: hashedPassword,
    });
    await newUser.save();
    console.log("Initial user created!");
  } else {
    console.log("User already exists.");
  }
}

// Call this function once after DB connection
//createInitialUser();

//test route
app.use("/api/auth", authRoute);

// get username
 app.get("/get/username", (req, res) => {
   Username.find()
     .then((data) => {
       res.json(data);
     })
     .catch((error) => res.json(error));
 });

//login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Username.findOne({ username });
    if (!user) {
      return res.json({ success: false });
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false, error: "Invalid password" });
    }
  } catch (error) {
    return res.json({ success: false, error: "User not found" });
  }
});

// add new product
app.post("/add_product", async (req, res) => {
  const {
    barcode,
    productName,
    investment,
    profit,
    unitPrice,
    stockQty,
    totalAmount,
    addtime,
    updatetime,
    status,
  } = req.body;
  try {
    const newProduct = new Product({
      barcode,
      productName,
      investment,
      profit,
      unitPrice,
      stockQty,
      totalAmount,
      addtime,
      updatetime,
      status,
    });
    await newProduct.save();
    res.json({ success: true, message: "Product added successfully" });
  } catch (error) {
    res.json({ success: false, error: "Error adding product" });
  }
});

//add person to credit
app.post("/add_credit_person", async (req, res) => {
  const { name, items, totalCredit } = req.body;

  try {
    const newPerson = new CreditPerson({
      name,
      items,
      totalCredit,
    });
    await newPerson.save();
    res.json({ success: true, message: "Credit person added successfully" });
  } catch (err) {
    res.json({ success: false, error: "Error adding credit person" });
  }
});

// get all product data
app.get("/get/products", (req, res) => {
  Product.find()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => res.json(error));
});

//get all orders
app.get("/get/orders", (req, res) => {
  OrderList.find()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => res.json(error));
});

//delete product
app.delete("/delete_product/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.json({ success: false, error: "Error deleting product" });
  }
});

// update product
app.put("/update/product/:id", async (req, res) => {
  const { barcode, productName, investment, profit, stockQty } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        barcode,
        productName,
        investment,
        profit,
        stockQty,
      },
      { new: true }
    );
    res.json(updatedProduct);
    res.json({ success: true, message: "Product updated successfully" });
  } catch (error) {
    res.json({ success: false, error: "Error updating product" });
  }
});

//update product stock
app.post("/update_stock", async (req, res) => {
  try {
    // req.body should be an array of { barcode, qty }
    for (const item of req.body) {
      await Product.updateOne(
        { barcode: item.barcode },
        { $inc: { stockQty: -Number(item.qty) } }
      );
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update stock" });
  }
});

// add new purchase
app.post("/add_purchase", async (req, res) => {
  const { orderId, items, totalPrice } = req.body;
  try {
    const newOrder = new OrderList({
      orderId,
      items,
      totalPrice,
      orderDate: new Date(),
    });
    await newOrder.save();
    res.json({ success: true, message: "Purchase added successfully" });
  } catch (error) {
    res.json({ success: false, error: "Error adding purchase" });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port 3000");
});
