import { useState, useEffect, useRef } from "react";

export default function Inputs({ setCardRefresh }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const inputRef = useRef(null);

  // Collapse when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        if (!title.trim() && !content.trim()) {
          setIsExpanded(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [title, content]);

  const handleSave = async () => {
    if (!content.trim() && !title.trim()) {
      alert("Note cannot be empty.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in. Please sign in again.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_SERVER_URL}/note/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          is_pinned: false,
          color: "bg-white",
        }),
      });

      if (res.status === 201) {
        setTitle("");
        setContent("");
        setIsExpanded(false);
        setCardRefresh((prev) => !prev);
      } else if (res.status === 401) {
        alert("Session expired. Please sign in again.");
      } else {
        alert("Something went wrong while saving the note.");
      }
    } catch (error) {
      console.error("Save note error:", error);
      alert("Network error. Try again later.");
    }
  };

  return (
    <div
      ref={inputRef}
      className={`transition-all duration-300 ease-in-out mx-4 lg:mx-96 mt-8 p-4 rounded-2xl shadow-xl border border-gray-300 bg-white/70 backdrop-blur-sm ${
        isExpanded ? "min-h-[130px]" : "min-h-[56px]"
      }`}
    >
      {isExpanded && (
        <input
          type="text"
          placeholder="Title"
          className="w-full text-lg font-semibold bg-transparent outline-none mb-1 placeholder-gray-600 text-gray-800 transition duration-150 focus:ring-0"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      )}
      <input
        type="text"
        placeholder="Take a note..."
        className="w-full text-base bg-transparent outline-none placeholder-gray-600 text-gray-800 transition duration-150 focus:ring-0"
        value={content}
        onClick={() => setIsExpanded(true)}
        onChange={(e) => setContent(e.target.value)}
      />
      {isExpanded && (
        <div className="mt-3 text-right">
          <button
            onClick={handleSave}
            className="px-4 py-1 text-sm font-medium text-white bg-gray-800 rounded-lg shadow hover:shadow-md hover:bg-gray-700 transition-all duration-200"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
