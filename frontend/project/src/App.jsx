import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import RoomList from "./pages/RoomList.jsx";
import ChatRoom from "./pages/ChatRoom.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/rooms"
            element={isAuthenticated ? <RoomList /> : <Navigate to="/login" />}
          />
          <Route
            path="/rooms/:roomId"
            element={isAuthenticated ? <ChatRoom /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/rooms" : "/login"} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;