import React, { useState } from 'react';
import './App.css'; // Optional styling file

function App() {
  const [audioFile, setAudioFile] = useState(null); // Stores the selected audio file
  const [transcript, setTranscript] = useState(''); // Stores raw transcription
  const [notes, setNotes] = useState('');           // Stores GPT-generated meeting notes
  const [loading, setLoading] = useState(false);    // For showing loading state
  const [error, setError] = useState(null);         // For displaying errors

  // Triggered when a user selects an audio file
  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  // Triggered when the user clicks "Upload"
  const handleUpload = async () => {
    if (!audioFile) {
      alert('Please select an audio file first!');
      return;
    }

    const formData = new FormData();
    formData.append('audio', audioFile);

    try {
      setLoading(true);
      setError(null);
      setTranscript('');
      setNotes('');

      const response = await fetch('http://localhost:3001/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process audio');
      }

      setTranscript(data.transcript);
      setNotes(data.notes);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>🎙️ GPT Meeting Notes Generator</h1>

      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Processing...' : 'Upload & Transcribe'}
      </button>

      {error && <p style={{ color: 'red' }}>❌ {error}</p>}

      {transcript && (
        <div className="output">
          <h2>📝 Transcript:</h2>
          <pre>{transcript}</pre>

          <h2>📋 Meeting Notes:</h2>
          <pre>{notes}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
