const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // Enable CORS
app.use(express.static("public")); // Serve static files

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API endpoint for image upload and text extraction
app.post("/upload", upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }

    console.log("✅ Received file:", req.file);
    console.log("📂 File type:", req.file.mimetype);
    console.log("📏 File size:", req.file.buffer.length, "bytes"); // Check if buffer exists

    try {
        console.log("🔍 Processing image with Tesseract...");
        const { data: { text } } = await Tesseract.recognize(req.file.buffer, "eng", {
            logger: (m) => console.log(m), // Logs OCR progress
        });

        console.log("✅ Text extracted successfully:", text);
        res.json({ text });
    } catch (error) {
        console.error("❌ OCR Error:", error.message);
        res.status(500).json({ error: "Failed to process the image." });
    }
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
