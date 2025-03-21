const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Tesseract = require("tesseract.js");

const app = express();
const port = 5000;

app.use(cors()); // Enable CORS
app.use(express.static("public")); // Serve static files

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Root route to confirm the server is running
app.get("/", (req, res) => {
    res.send("Text Reader App is running!");
});

// API endpoint for image upload and text extraction
app.post("/upload", upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }

    try {
        const { data: { text } } = await Tesseract.recognize(req.file.buffer, "eng");
        res.json({ text });
    } catch (error) {
        console.error("OCR Error:", error);
        res.status(500).json({ error: "Failed to process the image." });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
