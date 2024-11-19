import express from "express";
import mongoose from "mongoose";

const app = express();
const port = 5000;

// MongoDB connection string
const MONGO_URI = "mongodb+srv://dhruv:01234@cluster0.h4pqr.mongodb.net/gofoodmern";

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// MongoDB Connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  });

// Global variables to store data
global.food_items = [];
global.foodCatagory = [];

// Fetch food items and categories on server start
mongoose.connection.once("open", async () => {
  try {
    const foodItemsCollection = mongoose.connection.db.collection("food_items");
    const foodCategoryCollection = mongoose.connection.db.collection("foodCatagory");

    global.food_items = await foodItemsCollection.find({}).toArray();
    global.foodCatagory = await foodCategoryCollection.find({}).toArray();

    if (global.food_items.length === 0) {
      console.log("No data found in 'food_items' collection");
    } else {
      console.log("Fetched food items:", global.food_items);
    }

    if (global.foodCatagory.length === 0) {
      console.log("No data found in 'food_categories' collection");
    } else {
      console.log("Fetched food categories:", global.foodCatagory);
    }
  } catch (error) {
    console.error("Error fetching initial data:", error.message);
  }
});

// Mongoose Schema and Model for User
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now },
});
const User = mongoose.model("User", UserSchema);

// Routes
const router = express.Router();

// Route: Fetch Food Data
router.get("/foodData", (req, res) => {
  try {
    if (global.food_items && global.foodCatagory) {
      res.json([global.food_items, global.foodCatagory]);
    } else {
      res.status(404).json({ error: "Food data not found" });
    }
  } catch (error) {
    console.error("Error in /foodData:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Route: Create User with validation
router.post("/createuser", async (req, res) => {
  const { name, email, password, location } = req.body;

  // Validate name length (greater than 5 characters)
  if (!name || name.length <= 5) {
    return res.status(400).json({ error: "Name must be greater than 5 characters." });
  }

  // Validate email format (basic regex check)
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  // Validate password length (greater than 4 characters)
  if (!password || password.length <= 4) {
    return res.status(400).json({ error: "Password must be greater than 4 characters." });
  }

  // Validate if all fields are provided
  if (!location) {
    return res.status(400).json({ error: "Location is required." });
  }

  try {
    // Create new user and save to database
    const user = new User({ name, email, password, location });
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error in /createuser:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route: Login User
router.post("/loginuser", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error in /loginuser:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.use("/api", router);

// Default Route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Start the Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
