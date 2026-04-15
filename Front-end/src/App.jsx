import { useState, useEffect } from "react";
import {
  useNavigate,
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GestionMiembros from "./pages/GestionMiembros";
import GestionStaff from "./pages/GestionStaff";
import { AccessControl } from "./pages/AccesControl";
import { History } from "./pages/History";
import { Estadisticas } from "./pages/Estadisticas";
import axios from "axios";
import NoFound from "./components/notFound";
import { Rutinas } from "./pages/Rutinas";

axios.defaults.withCredentials = true;
const API_URL = "/api/auth";

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // Intenta obtener los datos del usuario del endpoint /me
        const response = await axios.get(`${API_URL}/me`);
        setUser(response.data); // Si tiene éxito, establece el usuario
      } catch (err) {
        console.log("No user session found.");
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-gray-200 border-t-[#D4AF37]"></div>
      </div>
    );
  }

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home user={user} error={error} />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register setUser={setUser} />}
        />
        <Route
          path="/access-control"
          element={
            user ? <AccessControl adminUser={user} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/members"
          element={user ? <GestionMiembros adminUser={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/employees"
          element={user ? <GestionStaff adminUser={user} /> : <Navigate to="/login" />}
        />
        
        <Route
          path="/history"
          element={user ? <History user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/estadisticas"
          element={
            user ? <Estadisticas user={user} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/rutinas"
          element={user ? <Rutinas user={user} /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<NoFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
