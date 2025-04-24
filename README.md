This application generates clean, structured meeting notes from audio recordings using OpenAI Whisper and GPT-3.5.

 Features:
 Upload meeting audio (MP3, WAV, etc.)

 Transcribe audio using OpenAI Whisper

 Summarize transcripts with GPT into:

        Summary

        Action Items

        Key Takeaways

How to Run:
1. Clone & Install
git clone https://github.com/your-username/gpt-meeting-notes-generator
cd gpt-meeting-notes-generator

# Terminal 1 - Backend
cd server
node index.js

# Terminal 2 - Frontend
cd client
npm run dev
Visit http://localhost:5173


Tech Stack
React + Vite

Node.js / Express

OpenAI API (Whisper + GPT-3.5)

Multer for file handling
