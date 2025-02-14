"use client";
import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://speech-translation.onrender.com"; // Update with your FastAPI URL

const App = () => {
  const [text, setText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [sttResult, setSttResult] = useState<string>("");
  const [ttsAudio, setTtsAudio] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sourceLang, setSourceLang] = useState<string>("en");
  const [targetLang, setTargetLang] = useState<string>("hi");
  const [ttsLang, setTtsLang] = useState<string>("hi");

  // Language options
  const languages: { [key: string]: string } = {
    "en": "English", "hi": "Hindi", "gom": "Gom", "kn": "Kannada", "doi": "Dogri",
    "brx": "Bodo", "ur": "Urdu", "ta": "Tamil", "ks": "Kashmiri", "as": "Assamese",
    "bn": "Bengali", "mr": "Marathi", "sd": "Sindhi", "mai": "Maithili", "pa": "Punjabi",
    "ml": "Malayalam", "mni": "Manipuri", "te": "Telugu", "sa": "Sanskrit", "ne": "Nepali",
    "sat": "Santali", "gu": "Gujarati", "or": "Odia"
  };

  // ✅ Translate Text
  const handleTranslate = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/bhashini/translate`, {
        pipelineTasks: [{
          taskType: "translation",
          config: {
            language: {
              sourceLanguage: sourceLang,
              targetLanguage: targetLang,
            },
          },
        }],
      });
      setTranslatedText(response.data.translated_content || "Translation Failed");
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  // ✅ Handle File Selection for STT
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  // ✅ Speech-to-Text (STT)
  const handleSTT = async () => {
    if (!selectedFile) {
      alert("Please upload an audio file.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", selectedFile);
    formData.append("sourceLanguage", sourceLang);

    try {
      const response = await axios.post(`${API_BASE_URL}/bhashini/stt`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setSttResult(response.data.transcription || "STT failed to process.");
    } catch (error) {
      console.error("STT Error:", error);
      alert("Speech-to-Text failed.");
    }
  };

  // ✅ Text-to-Speech (TTS)
  const handleTTS = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/bhashini/tts`, {
        pipelineTasks: [{
          taskType: "tts",
          config: {
            language: { sourceLanguage: ttsLang },
            gender: "female",
          },
        }],
      });

      if (response.data.audio_content) {
        const audioBlob = new Blob([Uint8Array.from(atob(response.data.audio_content), c => c.charCodeAt(0))], {
          type: "audio/wav",
        });
        setTtsAudio(URL.createObjectURL(audioBlob));
      } else {
        alert("TTS failed.");
      }
    } catch (error) {
      console.error("TTS Error:", error);
      alert("Text-to-Speech failed.");
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
        <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
          {Object.entries(languages).map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>

        <label style={{ marginLeft: "10px" }}>To: </label>
        <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
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
        <select value={ttsLang} onChange={(e) => setTtsLang(e.target.value)}>
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
