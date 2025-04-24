require('dotenv').config(); // Loads environment variables from .env
const express = require('express'); // Web framework
const multer = require('multer'); // Middleware to handle multipart/form-data (like audio files)
const cors = require('cors'); // Allows cross-origin requests from frontend
const path = require('path'); // Utility module for working with file paths
const { transcribeAudio, generateMeetingNotes } = require('./transcription'); // Import functions

const app = express(); // Initialize Express application
const upload = multer({ dest: 'uploads/' }); // Configure Multer to save uploads to /uploads

// Enable CORS and JSON parsing middleware
app.use(cors());
app.use(express.json());

/**
 * Route: POST /transcribe
 * Description: Handles audio upload, transcribes it, and generates GPT-powered meeting notes
 */
app.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    console.log('📁 Uploaded File Info:', req.file); // 👈 Add this line

    const filePath = req.file.path;
    const transcript = await transcribeAudio(filePath);
    const notes = await generateMeetingNotes(transcript);

    res.json({ transcript, notes });
  } catch (error) {
    console.error('Error handling transcription:', error);
    res.status(500).json({ error: 'Transcription and note generation failed' });
  }
});


// Start the backend server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🟢 Server listening on http://localhost:${PORT}`);
});
