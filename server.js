// server.js
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./authMiddleware");
const { encrypt, decrypt } = require("./encryption");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");  

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;


//Test API Clever Cloud
app.get("/", (req, res) => {
  res.send("API is running on Clever Cloud");
});

// Middleware
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ✅ MySQL Connection

let db;

// Detect if running on Clever Cloud 
if (process.env.MYSQL_ADDON_HOST) {
  console.log(" Using Clever Cloud MySQL");

  db = mysql.createConnection({
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB,
    port: process.env.MYSQL_ADDON_PORT,
  });
} else {
  console.log("Using Localhost MySQL");

  db = mysql.createConnection({
    host: "localhost",
    user: "nodeuser",
    password: process.env.DB_PASSWORD,
    database: "cruddb",
  });
}


db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL Database");
  }
});


// 🧍‍♂️ REGISTER (Create New User)
app.post("/api/register", async (req, res) => {
  try {
    let data = req.body;

    // Decrypt if encrypted payload is provided
    if (data.encrypted) {
      const decryptedText = decrypt(data.encrypted);
      data = JSON.parse(decryptedText);
    }

    const { fname, lname, email, username, password } = data;

    // ✅ Validate required fields
    if (!fname || !lname || !email || !username || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // ✅ Name validation
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(fname) || !nameRegex.test(lname)) {
      return res
        .status(400)
        .json({ message: "First and last name should only contain letters." });
    }

    // ✅ Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // ✅ Username validation
    const usernameRegex = /^[A-Za-z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        message:
          "Username should be 3–20 characters and contain only letters, numbers, or underscores.",
      });
    }

    // ✅ Password validation (min 6 chars)
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Check if email or username already exists
    const checkSql = "SELECT * FROM users WHERE email = ? OR username = ?";
    db.query(checkSql, [email, username], async (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.length > 0) {
        return res
          .status(400)
          .json({ message: "Email or username already registered." });
      }

      // ✅ Insert new user
      const sql =
        "INSERT INTO users (fname, lname, email, username, password) VALUES (?, ?, ?, ?, ?)";
      db.query(
        sql,
        [fname, lname, email, username, hashedPassword],
        (err, result) => {
          if (err) return res.status(500).json({ error: err });
        // Encrypt response
        const encryptedResponse = encrypt(
          JSON.stringify({ message: "User registered", userId: result.insertId })
        );
        res.json({ "message": "registered data ", encrypted: encryptedResponse });
        }
      );
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(400).json({ message: "Invalid encrypted data." });
  }
});


// 🧍 LOGIN (for token generation)
app.post("/api/login", (req, res) => {
    try {
    let data = req.body;

    //  Decrypt if encrypted
    if (data.encrypted) {
      const decryptedText = decrypt(data.encrypted);
      data = JSON.parse(decryptedText);
    }
  const { email, password } = data;
    if (!email || !password)
    return res.status(400).json({ message: "Email and password required." });

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0)
      return res.status(401).json({ message: "Invalid email or password." });

    const user = results[0];

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password." });

    // ✅ Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },process.env.JWT_SECRET,{ expiresIn: "1h" }
    );

    // Encrypt response
    const encryptedResponse = encrypt(
      JSON.stringify({ message: "Login successful", token })
    );
      res.json({ "message": "Login successful", token: token, encrypted: encryptedResponse });
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(400).json({ message: "Invalid encrypted data." });
  }
});


// ✅ CREATE USER (POST)
app.post("/api/users", authenticateToken, async (req, res) => {
    try {
    let data = req.body;

    // Decrypt incoming payload (if encrypted)
    if (data.encrypted) {
      const decryptedText = decrypt(data.encrypted);
      data = JSON.parse(decryptedText);
    }
  const { fname, lname, email, username, password } = data;

  // Check required fields
  if (!fname || !lname || !email || !username || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Validate names
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(fname) || !nameRegex.test(lname)) {
    return res
      .status(400)
      .json({ message: "First and last name must contain only letters." });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  // Validate username
  const usernameRegex = /^[A-Za-z0-9_]{3,20}$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      message:
        "Username should be 3–20 characters long, letters/numbers/underscores only.",
    });
  }

  // Check duplicates (email or username)
  const checkSql = "SELECT * FROM users WHERE email = ? OR username = ?";
  db.query(checkSql, [email, username], async (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length > 0) {
      return res
        .status(400)
        .json({ message: "Email or username already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const insertSql =
      "INSERT INTO users (fname, lname, email, username, password) VALUES (?, ?, ?, ?, ?)";
    db.query(
      insertSql,
      [fname, lname, email, username, hashedPassword],
      (err, result) => {
        if (err) return res.status(500).json({ error: err });
          // Encrypt response before sending back
          const encryptedResponse = encrypt(
            JSON.stringify({ message: "User created successfully",userId: result.insertId,})
          );
          res.json({"message": "User Creadted", encrypted: encryptedResponse });
        }
      );
    });
  } catch (error) {
    console.error("Create User Error:", error);
    res.status(400).json({ message: "Invalid encrypted data." });
  }
});


// ✅ READ (GET all with pagination, sorting, filtering)
app.get("/api/users", authenticateToken, (req, res) => {
  try {
    let { page = 1, limit = 10, sortBy = "id", order = "asc", search = "" } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const offset = (page - 1) * limit;

    const searchPattern = `%${search}%`;

    const sql = `
      SELECT * FROM users
      WHERE fname LIKE ? OR lname LIKE ? OR email LIKE ?
      ORDER BY ${sortBy} ${order}
      LIMIT ? OFFSET ?
    `;

    db.query(sql, [searchPattern, searchPattern, searchPattern, limit, offset], (err, results) => {
      if (err) return res.status(500).json({ error: err });

      const encryptedResponse = encrypt(JSON.stringify(results));
      const decryptedResponse = decrypt(encryptedResponse);

      res.json({
        message: "Users fetched successfully",
        pagination: {
          page,
          limit,
          count: results.length
        },
        encrypted: encryptedResponse,
        decrypted: JSON.parse(decryptedResponse)
      });
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ✅ READ (GET one)
app.get("/api/users/:id", authenticateToken, (req, res) => {
  const sql = "SELECT * FROM users WHERE id = ?";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0)
      return res.status(404).json({ message: "User not found" });
      const encryptedResponse = encrypt(JSON.stringify(results[0])); 
      res.json({"message": "User fetched successfully", encrypted: encryptedResponse });
  });
});


// ✅ UPDATE (PUT)
app.put("/api/users/:id", authenticateToken, async (req, res) => {
  try {
    let data = req.body;

    // Decrypt payload if encrypted
    if (data.encrypted) {
      const decryptedText = decrypt(data.encrypted);
      data = JSON.parse(decryptedText);
    }
  const { fname, lname, email, username, password } = data;
  const userId = req.params.id;

  if (!fname || !lname || !email || !username) {
    return res.status(400).json({ message: "First name, last name, email, and username are required." });
  }

  const checkSql =
    "SELECT * FROM users WHERE (email = ? OR username = ?) AND id != ?";
  db.query(checkSql, [email, username, userId], async (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length > 0)
      return res.status(400).json({ message: "Email or username already taken." });

    let updateSql, params;
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateSql =
        "UPDATE users SET fname=?, lname=?, email=?, username=?, password=? WHERE id=?";
      params = [fname, lname, email, username, hashedPassword, userId];
    } else {
      updateSql =
        "UPDATE users SET fname=?, lname=?, email=?, username=? WHERE id=?";
      params = [fname, lname, email, username, userId];
    }

    db.query(updateSql, params, (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "User not found." });
        const encryptedResponse = encrypt(
          JSON.stringify({ message: "User updated successfully." })
        );
        res.json({"message": "successfuly Updated", encrypted: encryptedResponse }); 
      });
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid encrypted data." });
    }
}); 


// DELETE USER + FILES
app.delete("/api/users/:id", authenticateToken, (req, res) => {
  const userId = req.params.id;

  // Step 1: Delete file records linked to user
  const deleteFilesSQL = "DELETE FROM files WHERE user_id = ?";

  db.query(deleteFilesSQL, [userId], (err) => {
    if (err) return res.status(500).json({ error: err });

    // Step 2: Delete user
    const deleteUserSQL = "DELETE FROM users WHERE id = ?";

    db.query(deleteUserSQL, [userId], (err, result) => {
      if (err) return res.status(500).json({ error: err });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found." });
      }

      // Encrypt response
      const encryptedResponse = encrypt(
        JSON.stringify({ message: "User deleted successfully." })
      );

      res.status(200).json({ "message": "successfuly Deleted", encrypted: encryptedResponse });
    });
  });
});


// ✅ FILE HANDLING

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder where files are saved
  },
  filename: function (req, file, cb) {
    // Rename file to avoid conflicts: userID_timestamp_originalName
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});

// File type validation (optional)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (!allowedTypes.includes(file.mimetype)) {
    cb(new Error("Only .jpg, .png, and .pdf files are allowed."), false);
  } else {
    cb(null, true);
  }
};

// Initialize multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

// ✅ Upload endpoint
app.post("/api/upload", authenticateToken, upload.single("file"), (req, res) => {
  console.log(" File received:", req.file);
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }
   console.log(" Authenticated user:", req.user);

  // Optionally save file info in database
  const fileData = {
    filename: req.file.filename,
    path: req.file.path,
    mimetype: req.file.mimetype,
    size: req.file.size,
  };

  // Save info in DB
  const sql = "INSERT INTO files (filename, path, mimetype, size, user_id) VALUES (?, ?, ?, ?, ?)";
  const values = [req.file.filename, req.file.path, req.file.mimetype, req.file.size, req.user.id];

  db.query(sql, values, (err) => {
    if (err) {
      console.error(" Error saving file info:", err);
      return res.status(500).json({ message: "Failed to save file info." });
    }
  });

  // Encrypt file metadata before sending response
  const encrypted = encrypt(JSON.stringify(fileData));
  res.status(200).json({ "message": "successfuly Upload File  ", encrypted });
});

// ✅ Serve uploaded files (GET)
app.get("/uploads/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);
  res.sendFile(filePath);
});


// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
