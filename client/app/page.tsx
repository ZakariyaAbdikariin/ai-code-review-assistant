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
        }
      );

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

      loadHistory();

    } catch (err) {
      setReview("Error generating review");
    }

    setLoading(false);
  };


  // 📜 OPEN HISTORY
  const openHistory = (item: Review) => {
    setCode(item.code);
    setReview(item.result);
  };


  // ✏️ RENAME REVIEW
  const renameReview = async (id: string) => {
    const title = prompt("Enter new review title:");

    if (!title) return;

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${id}`,
        {
          title,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      loadHistory();

    } catch (err) {
      console.log("Rename failed");
    }
  };


  // 🗑 DELETE REVIEW
  const deleteReview = async (id: string) => {
    const confirmDelete = confirm(
      "Delete this review?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      loadHistory();

      setReview("");

    } catch (err) {
      console.log("Delete failed");
    }
  };


  return (
    <div className="flex h-screen bg-gray-50">


      {/* LEFT SIDEBAR */}
      <div
        className="w-[30%] border-r border-gray-200 p-4 overflow-y-auto bg-white"
      >

        <h3 className="text-lg font-semibold mb-3">
          History
        </h3>


        {history.map((item) => (

          <div
            key={item.id}
            className="p-3 mb-3 bg-gray-100 rounded"
          >

            <div
              onClick={() => openHistory(item)}
              className="cursor-pointer"
            >

              <h4 className="font-semibold">
                {item.title || "Untitled Review"}
              </h4>


              <pre className="text-xs mt-2">
                {item.code.slice(0, 60)}...
              </pre>

            </div>


            <div className="flex gap-2 mt-3">

              <button
                onClick={() => renameReview(item.id)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
              >
                Rename
              </button>


              <button
                onClick={() => deleteReview(item.id)}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded"
              >
                Delete
              </button>

            </div>

          </div>

        ))}


      </div>



      {/* RIGHT PANEL */}
      <div className="w-[70%] p-6">


        <h1 className="text-2xl font-bold mb-4">
          AI Code Review Assistant 🤖
        </h1>


        {/* MONACO EDITOR */}
        <div
          style={{
            border: "1px solid #ddd",
            height: "400px",
          }}
        >

          <Editor
            height="400px"
            defaultLanguage="javascript"
            value={code}
            onChange={(value) =>
              setCode(value || "")
            }
          />

        </div>



        {/* BUTTON */}
        <button
          onClick={runReview}
          className="mt-3 px-5 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
        >

          {loading
            ? "Analyzing..."
            : "Run AI Review"}

        </button>



        {/* TEST BOX */}
        <div className="bg-blue-600 text-white text-xl font-bold p-3 rounded mt-4">

          TAILWIND WORKS 🚀

        </div>



        {/* OUTPUT */}
        <div
          className="mt-5 p-4 bg-gray-100 rounded whitespace-pre-wrap"
        >

          {review}

        </div>


      </div>


    </div>
  );
}
