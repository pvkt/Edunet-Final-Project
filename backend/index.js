const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const fs = require("fs");  //image
const sharp = require("sharp"); //image

console.log("MongoDB URI:", process.env.MONGO_URI);

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Image Storage Engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage: storage });

//! Image Upload Route (changed / size changed)
app.post("/upload", upload.single("product"), async (req, res) => {
  try {
    const inputPath = req.file.path;
    const outputPath = `upload/images/resized_${req.file.filename}`;

    // Resize to 500x500 using sharp
    await sharp(inputPath)
      .resize(500, 500)
      .toFile(outputPath);

    // Delete original file
    fs.unlinkSync(inputPath);

    res.json({ success: 1, image_url: `/images/${"resized_" + req.file.filename}` });
  } catch (err) {
    console.error("Image resize error:", err);
    res.status(500).json({ success: 0, message: "Image processing failed." });
  }
});


// Serve Images
app.use("/images", express.static("upload/images"));

// Middleware to Authenticate User
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ error: "Unauthorized access. Please login." });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token. Please login again." });
  }
};

// User Model
const Users = mongoose.model("Users", {
  username: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: Number, required: true },
  cartData: { type: Object, default: {} },
  date: { type: Date, default: Date.now },
});

// Product Model
const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number },
  available: { type: Boolean, default: true },
  date: { type: Date, default: Date.now },
});

// Root API Route
app.get("/", (req, res) => {
  res.send("E-Commerce API Running...");
});

// User Registration (Signup)
app.post("/signup", async (req, res) => {
  console.log("Signup Request Received");

  const { username, gender, phone, email, password, confirmPassword, address, pincode } = req.body;

  let errors = {};

  if (!/^[a-z0-9 ]{3,15}$/.test(username.trim())) {
    errors.username = "Username must be 3-15 characters (a-z, 0-9, space only).";
  }

  if (!gender || (gender !== "male" && gender !== "female")) {
    errors.gender = "Please select a valid gender.";
  }

  if (!/^\d{10}$/.test(phone.trim())) {
    errors.phone = "Enter a valid 10-digit phone number.";
  }

  if (!/\S+@\S+\.\S+/.test(email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (password.length > 18) {
    errors.password = "Password should be less than 18 characters.";
  } else if (!/^[A-Za-z0-9@#!_]+$/.test(password)) {
    errors.password = "Password can only contain letters, numbers, and @, #, !, _.";
  } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@#!_])/.test(password)) {
    errors.password = "Password must include uppercase, lowercase, number, and special character (@, #, !, _).";
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (!address.trim() || address.length > 50 || !/^[A-Za-z0-9\s,/-]+$/.test(address)) {
    errors.address = "Address must be < 50 characters and only allow A-Z, a-z, spaces, ',', '/', or '-'.";
  }

  if (!/^\d{6}$/.test(pincode)) {
    errors.pincode = "Enter a valid 6-digit pincode.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  let existingUser = await Users.findOne({ $or: [{ email }, { username }, { phone }] });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      errors: {
        email: existingUser.email === email ? "Email already exists!" : undefined,
        username: existingUser.username === username ? "Username already taken!" : undefined,
        phone: existingUser.phone === phone ? "Phone number already in use!" : undefined,
      },
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new Users({
    username: username.trim(),
    gender,
    email: email.trim(),
    phone: phone.trim(),
    password: hashedPassword,
    address: address.trim(),
    pincode,
  });

  await user.save();

  const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({ success: true, token, message: "User registered successfully!" });
});

// User Login
app.post("/login", async (req, res) => {
  console.log("Login Request Received");
  const { emailOrUsername, password } = req.body;

  let user = await Users.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });

  if (!user) {
    return res.status(400).json({ success: false, errors: "Invalid email/username or password." });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ success: false, errors: "Invalid email/username or password." });
  }

  const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({ success: true, token });
});

//! 🚀 Add Product Route (this is what was missing!)
app.post("/addproduct", async (req, res) => {
  try {
    const latestProduct = await Product.findOne().sort({ id: -1 }).exec();
    const newId = latestProduct ? latestProduct.id + 1 : 1;

    const newProduct = new Product({
      ...req.body,
      id: newId,
    });

    await newProduct.save();
    res.status(201).json({ success: true, message: "Product added!" });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ success: false, message: "Failed to add product." });
  }
});

// Get All Products
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  res.send(products);
});

//!  Remove Product Route
app.post("/removeproduct", async (req, res) => {
  const { id } = req.body;
  try {
    await Product.findOneAndDelete({ id });
    res.json({ success: true, message: "Product removed." });
  } catch (error) {
    console.error("Failed to remove product:", error);
    res.status(500).json({ success: false });
  }
});

//! Cart Routes

//add to cart
app.post("/addtocart", fetchUser, async (req, res) => {
  let user = await Users.findOne({ _id: req.user.id });
  user.cartData[req.body.itemId] = (user.cartData[req.body.itemId] || 0) + 1;
  await user.save();
  res.send("Product added to cart");
});

//remove from cart
app.post("/removefromcart", fetchUser, async (req, res) => {
  let user = await Users.findOne({ _id: req.user.id });
  if (user.cartData[req.body.itemId] > 0) {
    user.cartData[req.body.itemId] -= 1;
    await user.save();
  }
  res.send("Product removed from cart");
});

//get cart
app.post("/getcart", fetchUser, async (req, res) => {
  let user = await Users.findOne({ _id: req.user.id });
  res.json(user.cartData);
});

//! product id (single product)
app.get("/product/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await Product.findOne({ id: productId });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//! // Get logged-in user's profile
app.get("/user/profile", fetchUser, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//! Update User Profile
app.put("/user/profile/update", fetchUser, async (req, res) => {
  try {
    const updates = req.body;

    // Ensure pincode is a number (for schema compatibility)
    if (updates.pincode) {
      updates.pincode = parseInt(updates.pincode);
    }

    const user = await Users.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Profile updated successfully!", user });
  } catch (error) {
    console.error("🔥 Error updating user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//! Change Password (in the profile settings)
app.put("/user/changepassword", fetchUser, async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, message: "Passwords do not match." });
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#_])[A-Za-z\d@#_]{8,18}$/.test(newPassword)) {
    return res.status(400).json({
      success: false,
      message: "Password must include uppercase, lowercase, number, and @, #, or _ symbol (8–18 characters).",
    });
  }

  try {
    const user = await Users.findById(req.user.id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Old password is incorrect." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ success: true, message: "Password updated successfully." });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

//! checkout function
const Order = mongoose.model("Order", new mongoose.Schema({
  userId: String,
  cartItems: Object,
  discount: Number,
  total: Number,
  timestamp: { type: Date, default: Date.now }
}));

app.post('/checkout', fetchUser, async (req, res) => {
  try {
    const { cartItems, discount, total } = req.body;
    const userId = req.user.id;

    const newOrder = new Order({
      userId,
      cartItems,
      discount,
      total
    });

    await newOrder.save();
    res.json({ success: true, message: 'Order placed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to store order' });
  }
});




//! ===========ORDERS=============

const verifyUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ success: false, message: "Access Denied" });

  try {
    const verified = jwt.verify(token, "your_secret_key"); // use your actual secret key
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ success: false, message: "Invalid Token" });
  }
};


// Get user's orders
app.get("/myorders", fetchUser, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("cartItems.items.productId"); // This pulls full product info

    const transformedOrders = orders.map((order) => {
      const itemsArray = order.cartItems.items?.map((item) => ({
        productId: {
          _id: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          image: item.productId.image
        },
        quantity: item.quantity
      })) || [];

      return {
        _id: order._id,
        totalAmount: order.total,
        orderDate: order.timestamp,
        items: itemsArray
      };
    });

    res.json({ success: true, orders: transformedOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});




//! ============

// Start Server
app.listen(port, () => console.log(`Server running on port ${port}`));
