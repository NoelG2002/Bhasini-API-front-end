"use client";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://speech-translation.onrender.com/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      setTranslatedText(data.translated_text);
    } catch (error) {
      console.error("Translation failed:", error);
      setTranslatedText("Translation error. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold">Bhasini Translator</h1>
      <textarea
        className="w-96 h-24 p-2 border border-gray-400 rounded mt-4"
        placeholder="Enter text to translate..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-3"
        onClick={handleTranslate}
        disabled={loading}
      >
        {loading ? "Translating..." : "Translate"}
      </button>
      {translatedText && (
        <div className="mt-4 p-4 bg-white border rounded shadow">
          <strong>Translated Text:</strong>
          <p>{translatedText}</p>
        </div>
      )}
    </div>
  );
}
