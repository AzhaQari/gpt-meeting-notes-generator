require('dotenv').config(); // loads env variables from .env
const express = require('express'); // imports web framwork modules
const multer = require('multer'); // middleware to handle the mp3/audio files
const cors = require('cors'); // allows frontend to access backend 
const path = require('path'); // module for working with file paths
const { transcribeAudio, generateMeetingNotes } = require('./transcription'); // loads transcribeAudio() and generateMeetingNotes() from transcription.js

const app = express(); // initializes Express app
const upload = multer({ dest: 'uploads/' }); // use multer to store uploaded audio to the uploads/ folder


app.use(cors());  // enables CORS in the app to allow frontend to talk to backend
app.use(express.json()); // enables the app to parse incoming JSON requests (POST bodies)


// this POST route handles the audio file upload and transcription
app.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    console.log('Uploaded File Info:', req.file); // used to debug/check file info

    const filePath = req.file.path; // path to the uploaded file
    const transcript = await transcribeAudio(filePath); // calls transcribeAudio() and saves the result to transcript
    const notes = await generateMeetingNotes(transcript); // calls generateMeetingNotes() and saves the result to notes

    res.json({ transcript, notes });  // sends json back to frontend with the transcript and notes
  } catch (error) {
    console.error('Error handling transcription:', error);
    res.status(500).json({ error: 'Transcription and note generation failed' });
  }
});


// Start the backend server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
