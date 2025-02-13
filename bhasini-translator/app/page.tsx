"use client";
import { useState } from "react";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("hi");

  const handleTranslate = async () => {
    const response = await fetch("https://speech-translation.onrender.com/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_text: inputText,
        source_lang: sourceLang,
        target_lang: targetLang,
      }),
    });

    const data = await response.json();
    setTranslatedText(data.translated_text || "Translation failed.");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Bhashini Translation</h1>

      {/* Input Textbox */}
      <textarea
        className="border p-2 rounded w-full max-w-md"
        rows={4}
        placeholder="Enter your text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      {/* Language Selection */}
      <div className="flex space-x-4 mt-4">
        <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="ta">Tamil</option>
          <option value="bn">Bengali</option>
          {/* Add more languages */}
        </select>

        <span>➡️</span>

        <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
          <option value="hi">Hindi</option>
          <option value="en">English</option>
          <option value="ta">Tamil</option>
          <option value="bn">Bengali</option>
          {/* Add more languages */}
        </select>
      </div>

      {/* Translate Button */}
      <button className="bg-blue-500 text-white px-4 py-2 mt-4 rounded" onClick={handleTranslate}>
        Translate
      </button>

      {/* Display Translation */}
      {translatedText && (
        <div className="mt-4 p-3 border bg-white rounded max-w-md">
          <strong>Translation:</strong>
          <p>{translatedText}</p>
        </div>
      )}
    </div>
  );
}
