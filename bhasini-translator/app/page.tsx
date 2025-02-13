"use client";

import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/bhashini";  // FastAPI Backend URL

const Home = () => {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const handleTranslate = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/translate`, {
        source_language: 0,  // Example: English
        content: text,
        target_language: 1   // Example: Hindi
      });

      setTranslatedText(response.data.translated_content || "Translation Failed");
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Bhashini Language Translator</h2>
      <textarea
        rows={4}
        placeholder="Enter text..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <button onClick={handleTranslate}>Translate</button>
      {translatedText && <p><strong>Translated:</strong> {translatedText}</p>}
    </div>
  );
};

export default Home;
