import { useState, useEffect, useRef } from "react";
import {
  TrashIcon,
  PencilIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@headlessui/react";
import { format } from "date-fns"; // ✅ install if not already: npm install date-fns

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Cards({ search, setSearch, cardRefresh }) {
  const [actions, setActions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempTitle, setTempTitle] = useState("");
  const [tempContent, setTempContent] = useState("");
  const [tempColor, setTempColor] = useState("");
  const cardRefs = useRef([]);

  const colorOptions = [
    "bg-white",
    "bg-red-200",
    "bg-yellow-200",
    "bg-green-200",
    "bg-blue-200",
    "bg-pink-200",
    "bg-indigo-200",
  ];

  useEffect(() => {
    const fetchActions = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_SERVER_URL}/note/all`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.status !== 200) throw new Error("Failed to fetch notes");

        const data = await res.json();
        const notes = data.notes.map((note) => ({
          note_id: note.note_id,
          title: note.title,
          content: note.content,
          color: note.color || "bg-white",
          is_pinned: note.is_pinned,
          created_at: note.created_at,
          updated_at: note.updated_at,
        }));

        const pinned = notes.filter((n) => n.is_pinned);
        const unpinned = notes
          .filter((n) => !n.is_pinned)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setActions([...pinned, ...unpinned]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchActions();
  }, [cardRefresh]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        editingIndex !== null &&
        cardRefs.current[editingIndex] &&
        !cardRefs.current[editingIndex].contains(e.target)
      ) {
        setEditingIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingIndex]);

  const handleEdit = (index) => {
    const note = actions[index];
    setEditingIndex(index);
    setTempTitle(note.title);
    setTempContent(note.content);
    setTempColor(note.color || "bg-white");
  };

  const handleSave = async () => {
    if (editingIndex === null) return;
    const note = actions[editingIndex];
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_SERVER_URL}/note/update/${note.note_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: tempTitle,
          content: tempContent,
          color: tempColor,
          is_pinned: note.is_pinned,
        }),
      });
      if (res.status === 200) {
  const refreshed = await fetch(`${import.meta.env.VITE_BACKEND_SERVER_URL}/note/all`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (refreshed.ok) {
    const data = await refreshed.json();
    const notes = data.notes.map((note) => ({
      note_id: note.note_id,
      title: note.title,
      content: note.content,
      color: note.color || "bg-white",
      is_pinned: note.is_pinned,
      created_at: note.created_at,
      updated_at: note.updated_at,
    }));

    const pinned = notes.filter((n) => n.is_pinned);
    const unpinned = notes
      .filter((n) => !n.is_pinned)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    setActions([...pinned, ...unpinned]);
    setEditingIndex(null);
  }
}
else {
        alert("Failed to update note.");
      }
    } catch (error) {
      alert("Network error.");
      console.error(error);
    }
  };

  const togglePin = async (index) => {
    const note = actions[index];
    const updatedPin = !note.is_pinned;
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_SERVER_URL}/note/update/${note.note_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...note,
          is_pinned: updatedPin,
        }),
      });

      if (res.status === 200) {
        const updated = [...actions];
        updated[index] = { ...note, is_pinned: updatedPin };

        const pinned = updated.filter((n) => n.is_pinned);
        const unpinned = updated
          .filter((n) => !n.is_pinned)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setActions([...pinned, ...unpinned]);
      }
    } catch (err) {
      alert("Pin update failed");
      console.error(err);
    }
  };

  const handleDelete = async (index) => {
    const note = actions[index];
    if (!window.confirm("Delete this note?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_SERVER_URL}/note/delete/${note.note_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.status === 200) {
        setActions((prev) => prev.filter((_, i) => i !== index));
        if (editingIndex === index) setEditingIndex(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8 py-10">
        {actions
          .filter((note) => {
            if (!search) return true;
            const escaped = search.replace(/[-/\\^$+?.()|[\]{}]/g, "\\$&");
            const pattern = escaped.replace(/\*/g, ".*").replace(/\?/g, ".");
            const regex = new RegExp(pattern, "i");
            return regex.test(note.title) || regex.test(note.content);
          })
          .map((note, index) => (
            <div
              key={index}
              ref={(el) => (cardRefs.current[index] = el)}
              className={classNames(
                note.color || "bg-white",
                "relative rounded-xl p-6 border border-gray-300 transition-all duration-300 hover:scale-105 shadow-lg overflow-hidden",
                editingIndex === index ? "min-h-[250px]" : "max-h-[140px]"
              )}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePin(index);
                }}
                className="absolute top-3 right-3"
                title={note.is_pinned ? "Unpin" : "Pin"}
              >
                <PaperClipIcon
                  className={classNames(
                    "h-6 w-6 transition-all duration-200",
                    note.is_pinned
                      ? "rotate-45 text-grey-700"
                      : "text-gray-400 hover:text-indigo-400"
                  )}
                />
              </button>

              {editingIndex === index ? (
                <div>
                  <input
                    className="w-full text-lg font-bold mb-2 bg-transparent border-b border-gray-400 focus:outline-none"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                  />
                  <textarea
                    className="w-full h-24 bg-transparent border-b border-gray-300 resize-none focus:outline-none"
                    value={tempContent}
                    onChange={(e) => setTempContent(e.target.value)}
                  />
                  <div className="text-xs text-gray-500 mt-2">
  Last updated{" "}
  {note.updated_at
    ? format(new Date(note.updated_at), "PPpp") // e.g., Jul 1, 2025 at 11:43 AM
    : "just now"}
</div>
                  <div className="flex gap-2 mt-3">
                    {colorOptions.map((color, i) => (
                      <div
                        key={i}
                        onClick={() => setTempColor(color)}
                        className={`w-5 h-5 rounded-full border-2 cursor-pointer ${color} ${
                          tempColor === color ? "border-black" : "border-transparent"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-green-200 hover:bg-green-300 text-green-900 rounded shadow"
                    >
                      <PencilIcon className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-red-200 hover:bg-red-300 text-red-900 rounded shadow"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div onClick={() => handleEdit(index)} className="cursor-pointer">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{note.title}</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-line line-clamp-4">
                    {note.content}
                  </p>
                </div>
              )}
            </div>
          ))}
      </div>

      {search && (
        <div className="text-center mb-10">
          <Button
            onClick={() => setSearch(null)}
            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-sm"
          >
            Clear Search
          </Button>
        </div>
      )}
    </>
  );
}
