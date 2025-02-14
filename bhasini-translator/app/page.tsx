"use client";
import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://speech-translation.onrender.com"; // FastAPI Backend URL

const App = () => {
  const [text, setText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [sttResult, setSttResult] = useState<string>("");
  const [sttLang, setSttLang] = useState<number>(0);
  const [ttsAudio, setTtsAudio] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sourceLang, setSourceLang] = useState<number>(0);
  const [targetLang, setTargetLang] = useState<number>(1);
  const [ttsLang, setTtsLang] = useState<number>(1);

  // Language options
  const languages: { [key: number]: string } = {
    0: "English", 1: "Hindi", 2: "Gom", 3: "Kannada", 4: "Dogri",
    5: "Bodo", 6: "Urdu", 7: "Tamil", 8: "Kashmiri", 9: "Assamese",
    10: "Bengali", 11: "Marathi", 12: "Sindhi", 13: "Maithili", 14: "Punjabi",
    15: "Malayalam", 16: "Manipuri", 17: "Telugu", 18: "Sanskrit", 19: "Nepali",
    20: "Santali", 21: "Gujarati", 22: "Odia"
  };

  // ✅ Handle File Selection for STT
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // ✅ Translate Text
  const handleTranslate = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/bhashini/translate`, {
        source_language: sourceLang,
        content: text,
        target_language: targetLang
      });
      setTranslatedText(response.data.translated_content || "Translation Failed");
    } catch (error) {
      console.error("Translation error:", error);
      alert("Translation failed. Please try again.");
    }
  };

  // ✅ Speech-to-Text (STT)
 const handleSTT = async () => {
  if (!selectedFile) {
    alert("Please select an audio file!");
    return;
  }

  const formData = new FormData();
  formData.append("audio", selectedFile);
  formData.append("language", sttLang.toString());  // Ensure it matches FastAPI

  try {
    const response = await axios.post(`${API_BASE_URL}/bhashini/stt`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data.status_code === 200) {
      setSttResult(response.data.transcription || "STT Failed");
    } else {
      alert(response.data.message || "STT Processing Error");
    }
  } catch (error) {
    console.error("STT Error:", error);
    alert("Error processing STT. Check console for details.");
  }
};


  // ✅ Text-to-Speech (TTS)
  const handleTTS = async () => {
    if (!text) {
      alert("Enter text for TTS!");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/bhashini/tts`, {
        language: ttsLang,
        text: text
      });

      if (response.data.status_code === 200 && response.data.audio_content) {
        const binaryString = atob(response.data.audio_content);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const audioBlob = new Blob([bytes], { type: "audio/wav" });

        setTtsAudio(URL.createObjectURL(audioBlob));
      } else {
        alert(response.data.message || "TTS Processing Error");
      }
    } catch (error) {
      console.error("TTS Error:", error);
      alert("Error processing TTS. Check console for details.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Bhashini Language Processing</h2>

      {/* Input Text */}
      <textarea
        rows={4}
        placeholder="Enter text..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      {/* Language Selection */}
      <div>
        <label>From: </label>
        <select value={sourceLang} onChange={(e) => setSourceLang(Number(e.target.value))}>
          {Object.entries(languages).map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>

        <label style={{ marginLeft: "10px" }}>To: </label>
        <select value={targetLang} onChange={(e) => setTargetLang(Number(e.target.value))}>
          {Object.entries(languages).map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>

        <button onClick={handleTranslate} style={{ marginLeft: "10px" }}>Translate</button>
      </div>

      {/* Translated Text */}
      {translatedText && (
        <div style={{ marginTop: "10px", padding: "10px", background: "#f1f1f1" }}>
          <strong>Translated:</strong> {translatedText}
        </div>
      )}

      {/* Speech-to-Text (STT) */}
    

      <div style={{ marginTop: "20px" }}>
        <h3>Speech-to-Text (STT)</h3>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button onClick={handleSTT} style={{ marginLeft: "10px" }}>Convert to Text</button>
      </div>

        <div style={{ marginTop: "10px" }}>
  <label>Choose STT Language: </label>
  <select value={sttLang} onChange={(e) => setSttLang(Number(e.target.value))}>
    {Object.entries(languages).map(([code, name]) => (
      <option key={code} value={code}>{name}</option>
    ))}
  </select>
</div>

      
      {/* STT Result */}
      {sttResult && (
        <div style={{ marginTop: "10px", padding: "10px", background: "#f1f1f1" }}>
          <strong>Transcribed Text:</strong> {sttResult}
        </div>
      )}

      {/* Text-to-Speech (TTS) */}
      <div style={{ marginTop: "20px" }}>
        <h3>Text-to-Speech (TTS)</h3>
        <label>Choose Language: </label>
        <select value={ttsLang} onChange={(e) => setTtsLang(Number(e.target.value))}>
          {Object.entries(languages).map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>
        <button onClick={handleTTS} style={{ marginLeft: "10px" }}>Convert to Speech</button>
      </div>

      {/* Play Generated Speech */}
      {ttsAudio && (
        <div style={{ marginTop: "10px" }}>
          <audio controls>
            <source src={ttsAudio} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default App;
