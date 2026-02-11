const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

const PORT = process.env.PORT || 3000;

// 🔒 Replace this with your public IP
const ALLOWED_PUBLIC_IP = process.env.ALLOWED_PUBLIC_IP;

app.use((req, res, next) => {
    const auth = req.headers.authorization;
  
    if (!auth || auth !== `Bearer ${process.env.ACCESS_TOKEN}`) {
      return res.status(401).send("Unauthorized");
    }
  
    next();
  });

// Homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Upload route
app.post("/upload", upload.single("file"), (req, res) => {
  res.send("File uploaded successfully!");
});

// List files
app.get("/files", (req, res) => {
  fs.readdir("./uploads", (err, files) => {
    if (err) return res.send([]);
    res.json(files);
  });
});

// Download file
app.get("/download/:name", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.name);
  res.download(filePath);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});