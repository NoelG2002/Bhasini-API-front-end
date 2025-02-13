"use client";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("hi");

  const handleTranslate = async () => {
    if (!text) {
      alert("Please enter text to translate");
      return;
    }

    try {
      const response = await fetch("https://speech-translation.onrender.com/translate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_text: text,
          source_lang: sourceLang,
          target_lang: targetLang
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setTranslatedText(data.translated_text);
      } else {
        alert(`Error: ${data.detail}`);
      }
    } catch (error) {
      console.error("Translation error:", error);
      alert("Failed to translate. Check console for details.");
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Multilingual Translator</h1>

      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your text"
        className="border p-2 rounded w-80"
      />

      <div className="flex mt-2">
        <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="ta">Tamil</option>
          <option value="ml">Malayalam</option>
        </select>

        <span className="mx-2">➡️</span>

        <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
          <option value="hi">Hindi</option>
          <option value="en">English</option>
          <option value="ta">Tamil</option>
          <option value="ml">Malayalam</option>
        </select>
      </div>

      <button
        onClick={handleTranslate}
        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
      >
        Translate
      </button>

      {translatedText && (
        <p className="mt-4 border p-2 rounded w-80 bg-gray-100">
          <strong>Translation:</strong> {translatedText}
        </p>
      )}
    </div>
  );
}
