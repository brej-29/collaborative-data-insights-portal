import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Datasets from "./pages/Datasets";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { useAuth as useAuthContext } from "./context/AuthContext"; // ✅ rename to avoid conflict
import useAuth from "./hooks/useAuth"; // ✅ your custom hook

function PrivateRoute({ children }: { children: React.JSX.Element }) {
  const { token } = useAuthContext();
  return token ? children : <LoginPage />;
}

function App() {
  const { token } = useAuthContext(); // still needed for routing logic
  const { user, logout } = useAuth();

  return (
    <div className="relative">
      <Router>
        <Header />

        {/* ✅ Top-right login state */}
      {token && (
        <div className="absolute top-4 right-6 z-50 text-sm bg-white px-3 py-1 rounded shadow flex items-center gap-2">
          👤 Logged in as <strong>{user?.username ?? "..."}</strong>
          <button
            onClick={logout}
            className="text-red-600 hover:underline ml-2"
          >
            🔓 Logout
          </button>
        </div>
      )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/datasets"
            element={
              <PrivateRoute>
                <Datasets />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
