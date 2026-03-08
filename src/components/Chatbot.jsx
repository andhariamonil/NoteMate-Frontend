import { useEffect, useState } from "react";
import {
  PaperAirplaneIcon,
  ChatBubbleLeftEllipsisIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_SERVER_URL}/ai/history`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", message: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_SERVER_URL}/ai/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ question: input }),
      });

      const data = await res.json();
      const botMsg = { sender: "bot", message: data.answer || "Sorry, no answer." };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", message: "Failed to connect to AI." }]);
    }
  };

  useEffect(() => {
    if (isOpen) fetchHistory();
  }, [isOpen]);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          className="bg-gray-700 text-white p-3 rounded-full shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <XMarkIcon className="w-6 h-6" /> : <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white rounded-lg shadow-xl flex flex-col overflow-hidden z-40">
          <div className="bg-gray-700 text-white p-3 font-semibold">NoteMate-Bot</div>
          <div className="flex-1 overflow-y-auto px-4 py-2 bg-gray-50 space-y-2 max-h-96">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-gray-100 self-end text-right ml-auto"
                    : "bg-gray-200 self-start text-left"
                }`}
              >
                {msg.message}
              </div>
            ))}
          </div>

          <div className="flex items-center border-t p-2 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-gray-700 text-white p-2 rounded-md"
            >
              <PaperAirplaneIcon className="w-5 h-5 transform rotate-45" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
