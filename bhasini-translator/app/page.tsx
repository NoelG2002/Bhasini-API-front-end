"use client";

import { useState } from "react";

export default function Home() {
    const [text, setText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [selectedSourceLang, setSelectedSourceLang] = useState(1); // Default: Hindi
    const [selectedTargetLang, setSelectedTargetLang] = useState(7); // Default: Tamil

    // Language options (should match backend's numbering)
    const languages = [
        { id: 1, name: "Hindi" },
        { id: 2, name: "Gom" },
        { id: 3, name: "Kannada" },
        { id: 4, name: "Dogri" },
        { id: 5, name: "Bodo" },
        { id: 6, name: "Urdu" },
        { id: 7, name: "Tamil" },
        { id: 8, name: "Kashmiri" },
        { id: 9, name: "Assamese" },
        { id: 10, name: "Bengali" },
        { id: 11, name: "Marathi" },
        { id: 12, name: "Sindhi" },
        { id: 13, name: "Maithili" },
        { id: 14, name: "Punjabi" },
        { id: 15, name: "Malayalam" },
        { id: 16, name: "Manipuri" },
        { id: 17, name: "Telugu" },
        { id: 18, name: "Sanskrit" },
        { id: 19, name: "Nepali" },
        { id: 20, name: "Santali" },
        { id: 21, name: "Gujarati" },
        { id: 22, name: "Odia" },
    ];

    // Handle translation request
    const handleTranslate = async () => {
        if (!text.trim()) {
            alert("Please enter text to translate!");
            return;
        }

        const response = await fetch("https://speech-translation.onrender.com/scaler/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                source_language: selectedSourceLang,
                content: text,
                target_language: selectedTargetLang
            })
        });

        const data = await response.json();
        if (data.status_code === 200) {
            setTranslatedText(data.translated_content);
        } else {
            alert("Translation failed. Please try again!");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Bhashini Translator</h1>

            {/* Source Language Dropdown */}
            <select 
                className="mb-2 p-2 border rounded"
                onChange={(e) => setSelectedSourceLang(parseInt(e.target.value))}
                value={selectedSourceLang}
            >
                {languages.map((lang) => (
                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                ))}
            </select>

            {/* Target Language Dropdown */}
            <select 
                className="mb-2 p-2 border rounded"
                onChange={(e) => setSelectedTargetLang(parseInt(e.target.value))}
                value={selectedTargetLang}
            >
                {languages.map((lang) => (
                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                ))}
            </select>

            {/* Input Text */}
            <textarea
                className="p-2 border rounded w-96 h-24"
                placeholder="Enter your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />

            {/* Translate Button */}
            <button 
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                onClick={handleTranslate}
            >
                Translate
            </button>

            {/* Translated Output */}
            {translatedText && (
                <div className="mt-4 p-4 border rounded bg-white w-96">
                    <h2 className="text-lg font-bold">Translated Text:</h2>
                    <p>{translatedText}</p>
                </div>
            )}
        </div>
    );
}
