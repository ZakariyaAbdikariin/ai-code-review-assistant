"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";

type Review = {
  id: string;
  title: string | null;
  code: string;
  result: string;
};

export default function Home() {
  const [code, setCode] = useState("function add(a,b){return a+b}");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Review[]>([]);

  // 🔐 TOKEN HELPER
  const getToken = () => localStorage.getItem("token");

  // 📜 LOAD HISTORY
  const loadHistory = async () => {
    try {
      const res = await axios.get(
  `${process.env.NEXT_PUBLIC_API_URL}/reviews`,
  {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setHistory(res.data);
    } catch (err) {
      console.log("Failed to load history");
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // 🤖 RUN AI REVIEW
  const runReview = async () => {
    setLoading(true);
    setReview("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/review`,
        { code },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setReview(res.data.review);

      // refresh history after saving
      loadHistory();
    } catch (err) {
      setReview("Error generating review");
    }

    setLoading(false);
  };

  // 📜 LOAD FROM HISTORY
  const openHistory = (item: Review) => {
    setCode(item.code);
    setReview(item.result);
  };

return (
  <div className="flex h-screen bg-gray-50">

    {/* LEFT SIDEBAR */}
    <div
    className="w-[30%] border-r border-gray-200 p-4 overflow-y-auto bg-white"
    >
    <h3 className="text-lg font-semibold mb-3">History</h3>

      {history.map((item) => (
        <div
          key={item.id}
          onClick={() => openHistory(item)}
          className="p-3 mb-2 cursor-pointer bg-gray-100 rounded hover:bg-gray-200 transition"
    >
          <pre style={{ fontSize: 12 }}>
            {item.code.slice(0, 60)}...
          </pre>
        </div>
      ))}
    </div>

    {/* RIGHT PANEL */}
    <div className="w-[70%] p-6">

      <h1 className="text-2xl font-bold mb-4">
      AI Code Review Assistant 🤖
      </h1>

      {/* MONACO EDITOR */}
      <div style={{ border: "1px solid #ddd", height: "400px" }}>
	<Editor
  	  height="400px"
  	  defaultLanguage="javascript"
  	  value={code}
  	  onChange={(value) => setCode(value || "")}
	/>
      </div>

      {/* BUTTON */}
      <button
        onClick={runReview}
        className="mt-3 px-5 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
      >
        {loading ? "Analyzing..." : "Run AI Review"}
      </button>

      {/* 🧪 TAILWIND TEST BOX (NEW) */}
      <div className="bg-blue-600 text-white text-xl font-bold p-3 rounded mt-4">
        TAILWIND WORKS 🚀
      </div>

      {/* OUTPUT */}
     <div className="mt-5 p-4 bg-gray-100 rounded whitespace-pre-wrap">
     {review}
     </div> 
    </div>
  </div>
);
}
