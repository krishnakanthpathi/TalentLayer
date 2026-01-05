import Navbar from "./components/Navbar";
import Galaxy from "./components/Galaxy";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import { useAuth } from "./context/AuthContext";

const Home = () => (
  <div className="w-screen h-screen" style={{ position: 'fixed' }}>
    <Galaxy />
  </div>
);

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
};

export default App;
