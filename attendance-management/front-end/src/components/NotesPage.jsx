import { useEffect, useState } from "react";
import { SendHorizonal } from "lucide-react";
import { useAuth } from "../providers/AuthProvider";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";

const NotesPage = () => {
  const { user } = useAuth();
  const location = useLocation().state;
  const userId = location?.userId || user._id;
  const userName = location?.name || `${user.firstName} ${user.lastName}`;
  const navigate = useNavigate();
  const [newNote, setNewNote] = useState("");
  const [allNotes, setAllNotes] = useState([]);

  useEffect(() => {
    if (userId) {
      handleFetchNotes(userId);
    }
  }, [userId]);

  const handleFetchNotes = (employeeId) => {
    axios
      .get(`/api/notes/employeeId/${employeeId}`)
      .then((res) => setAllNotes(res.data.notes))
      .catch((err) => console.error("Error fetching notes:", err));
  };

  const handleSend = () => {
    if (!newNote.trim()) return;
    if (user.roleInfo.role === "employee") {
      axios
        .post("/api/notes/addbyemployee", {
          content: newNote,
          employeeId: user._id,
        })
        .then((res) => {
          console.log("Note posted:", res.data);
          setNewNote("");
          handleFetchNotes(user._id);
        })
        .catch((err) => console.error("Error posting note:", err));
      return;
    } else {
      axios
        .post("/api/notes/addbyadmin", {
          content: newNote,
          employeeId: userId,
          sendBy: user._id,
          sendByRole: user.roleInfo?.role,
        })
        .then((res) => {
          console.log("Note posted:", res.data);
          setNewNote("");
          handleFetchNotes(userId);
        })
        .catch((err) => console.error("Error posting note:", err));
    }
  };

  return (
    <div className="max-w-screen mx-auto bg-white h-[90vh] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-green-900 text-white p-4 flex justify-start items-center">
        <div className="px-4 py-2" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </div>
        <h2 className="text-lg font-semibold">{userName}</h2>
      </div>

      {/* All previous notes from backend */}
      <div className="px-4 py-2 overflow-y-auto flex-1">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Previous Notes
        </h4>
        {allNotes.length > 0 ? (
          allNotes.map((item) => (
            <div
              key={item._id}
              className="bg-gray-50 border border-gray-200 p-3 leading-loose rounded-md text-sm text-gray-700 mb-2"
            >
              <div className="flex gap-2">
                <span>
                  {item?.sendBy?.firstName
                    ? `${item.sendBy.firstName} ${item.sendBy.lastName}`
                    : `${userName}`}
                </span>
                <span className="text-[0.6rem] text-green-500">
                  {item?.sendByRole}
                </span>
              </div>
              <span className="font-bold">{item.content}</span>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(item.createdAt).toLocaleString("en-IN")}
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm italic">No notes yet.</p>
        )}
      </div>

      {/* Input Area */}
      <div className="fixed bottom-16 min-w-screen flex items-center py-2 px-4 border-t bg-white">
        <button variant="ghost" className="p-2">
          😊
        </button>
        <input
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Save a note..."
          className="flex-1 mx-2 outline-none"
        />
        <button
          onClick={handleSend}
          variant="ghoust"
          className="p-2"
          size="icon"
        >
          <SendHorizonal size={16} />
        </button>
      </div>
    </div>
  );
};

export default NotesPage;
