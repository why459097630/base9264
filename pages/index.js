import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    setResponse("Generating with AI...");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(data.code);
      } else {
        setResponse("❌ Error: " + data.error);
      }
    } catch (err) {
      setResponse("❌ Network error: " + err.message);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 flex flex-col items-center px-4 py-12">
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Build your app with one sentence
      </motion.h1>

      <motion.div
        className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label className="block mb-2 text-sm font-semibold text-gray-600">
          Describe your app idea:
        </label>
        <input
          className="w-full px-4 py-3 mb-4 text-gray-700 bg-gray-100 rounded-xl focus:outline-none"
          placeholder="e.g. A todo list app with dark mode"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-all"
        >
          Generate App
        </button>
      </motion.div>

      {response && (
        <motion.div
          className="mt-8 p-6 max-w-xl bg-white rounded-2xl shadow-lg text-left text-gray-700 whitespace-pre-wrap text-sm overflow-x-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <pre>{response}</pre>
        </motion.div>
      )}
    </main>
  );
}
