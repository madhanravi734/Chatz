import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useSocket } from "../context/SocketContext.jsx";

function ChatRoom() {
  const { roomId } = useParams();
  const { token } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/messages/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data.messages);
      } catch (err) {
        console.log(err);
      }
    };
    fetchHistory();
  }, [roomId]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join_room", roomId);

    const handleReceive = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("receive_message", handleReceive);
    };
  }, [socket, roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    socket.emit("send_message", { roomId, chat: chatInput });
    setChatInput("");
  };

  return (
    <div>
      <button className="back-btn" onClick={() => navigate("/rooms")}>Back to Rooms</button>
      <h2>Room: {roomId}</h2>

      <div
        className="message-box"
        style={{ height: "300px", overflowY: "auto", padding: "10px", border: "1px solid #1e1f22" }}
      >
        {messages.map((msg) => (
          <div key={msg._id}>
            <strong>{msg.sentby?.username || msg.sentby}:</strong> {msg.chat}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend}>
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatRoom;