import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [error, setError] = useState("");
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      const res = await api.get("/rooms/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(res.data.rooms);
    } catch (err) {
      setError("Failed to load rooms");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        "/rooms/create",
        { name: newRoomName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewRoomName("");
      fetchRooms();
    } catch (err) {
      setError("Failed to create room");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <h1>Rooms</h1>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>

      <form onSubmit={handleCreateRoom}>
        <input
          type="text"
          placeholder="New room name"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
        />
        <button type="submit">Create Room</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {rooms.map((room) => (
          <li key={room._id}>
            {room.name}{" "}
            <button onClick={() => navigate(`/rooms/${room._id}`)}>
              Join
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RoomList;