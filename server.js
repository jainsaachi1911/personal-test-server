const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

const PORT = process.env.PORT || 3000;

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// 🔐 Token middleware
app.use((req, res, next) => {
  const token = req.query.token;

  if (!token || token !== process.env.ACCESS_TOKEN) {
    return res.status(401).send("Unauthorized");
  }

  next();
});

// Serve homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Upload encrypted file (server does NOT decrypt)
app.post("/upload", upload.single("file"), (req, res) => {
  res.send(`
    <h3>Encrypted file uploaded successfully!</h3>
    <a href="/?token=${req.query.token}">Go Back</a>
  `);
});

// List encrypted files
app.get("/files", (req, res) => {
  fs.readdir("./uploads", (err, files) => {
    if (err) return res.json([]);
    res.json(files);
  });
});

// Download encrypted file (browser decrypts)
app.get("/download/:name", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.name);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  res.sendFile(path.resolve(filePath));
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});