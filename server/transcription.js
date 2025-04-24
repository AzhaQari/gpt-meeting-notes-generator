const fs = require('fs'); // module for reading audio files
const { OpenAI } = require('openai'); // OpenAI library for API calls 

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // initialize openai client w my key

/**
 * Transcribes an audio file using OpenAI Whisper
 * @param {string} filePath - Path to the audio file
 * @returns {Promise<string>} - Transcribed text
 */
async function transcribeAudio(filePath) {
  try {
    const ext = '.mp3'; // added this because multer keeps stripping the extension off the file name
    const renamedPath = `${filePath}${ext}`;

    // Rename the uploaded file to include the correct extension
    fs.renameSync(filePath, renamedPath);

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(renamedPath),
      model: 'whisper-1',
    });

    return transcription.text;
  } catch (err) {
    console.error('Transcription error:', err);
    throw err;
  }
}

/**
 * Uses GPT to generate structured meeting notes from a transcript.
 * @param {string} transcript - Raw transcript of the meeting
 * @returns {Promise<string>} - Returns GPT-formatted meeting notes
 */
async function generateMeetingNotes(transcript) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use GPT-3.5 or GPT-4 depending on your needs
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that summarizes meetings. 
                    Your task is to generate structured meeting notes from the provided transcript.
                    The notes should be clear and thorough, highlighting the main points discussed, action items, and key takeaways.
                    Make sure to include all important details and avoid unnecessary filler.
                    Your output should be cleanly formatted into:
                    - Summary
                    - Action Items
                    - Key Takeaways`,
        },
        {
          role: 'user',
          content: `Here is the transcript of the meeting:\n\n${transcript}`,
        },
      ],
      max_tokens: 10000, // Control output length (adjust based on your needs)
    });

    return response.choices[0].message.content; // Extract the generated notes
  } catch (err) {
    console.error('GPT note generation error:', err);
    throw err;
  }
}

// Export both functions for use in the Express server
module.exports = { transcribeAudio, generateMeetingNotes };