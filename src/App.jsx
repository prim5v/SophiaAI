import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AnimatePresence } from "framer-motion";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import GuestDashboard from "./pages/GuestDashboard";
import Login from "./pages/Login";

import { ChatProvider } from "./contexts/ChatContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";

// Protect dashboard
function PrivateRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return isLoggedIn ? children : <Navigate to="/guest" replace />;
}

// Prevent logged-in users from accessing guest pages
function GuestRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return isLoggedIn ? <Navigate to="/dashboard" replace /> : children;
}

function AppContent() {
  const { isLoggedIn, loading } = useAuth();
  const [hasVisited, setHasVisited] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem("hasVisited");
    setHasVisited(!!visited);
  }, []);

  const handleEnterApp = () => {
    localStorage.setItem("hasVisited", "true");
    setHasVisited(true);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AnimatePresence mode="wait">
      <Routes>

        {/* Landing page logic */}
        <Route
          path="/"
          element={
            !hasVisited ? (
              <LandingPage onEnter={handleEnterApp} />
            ) : isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/guest" replace />
            )
          }
        />

        {/* Guest dashboard (block for logged-in users) */}
        <Route
          path="/guest"
          element={
            <GuestRoute>
              <GuestDashboard />
            </GuestRoute>
          }
        />

        {/* Login page */}
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />

        {/* Protected dashboard */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export function App() {
  return (
    <Router>
      <AuthProvider>
        <ChatProvider>
          <div className="min-h-screen bg-gray-950 text-gray-100">
            <AppContent />
            <Toaster position="top-right" theme="dark" />
          </div>
        </ChatProvider>
      </AuthProvider>
    </Router>
  );
}
