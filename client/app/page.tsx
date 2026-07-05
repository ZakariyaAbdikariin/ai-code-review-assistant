"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [code, setCode] = useState("function add(a,b){return a+b}");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const runReview = async () => {
    setLoading(true);
    setReview("");

    try {
      const res = await axios.post("http://localhost:5000/api/review", {
        code,
      });

      setReview(res.data.review);
    } catch (err) {
      setReview("Error generating review");
    }

    setLoading(false);
  };

  return (
    <div style={{
      maxWidth: "900px",
      margin: "40px auto",
      fontFamily: "Arial"
    }}>
      <h1>AI Code Review Assistant 🤖</h1>

      <textarea
        style={{
          width: "100%",
          height: "220px",
          padding: "10px",
          fontFamily: "monospace",
          borderRadius: "8px"
        }}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        onClick={runReview}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          cursor: "pointer",
          background: "black",
          color: "white",
          borderRadius: "6px"
        }}
      >
        {loading ? "Analyzing..." : "Run AI Review"}
      </button>

      <div style={{
        marginTop: "20px",
        padding: "15px",
        background: "#f4f4f4",
        borderRadius: "8px",
        whiteSpace: "pre-wrap"
      }}>
        {review}
      </div>
    </div>
  );
}
