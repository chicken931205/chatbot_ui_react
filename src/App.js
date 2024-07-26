import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ChatPage from "./pages/ChatPage/ChatPage";
import LandingPage from "./pages/LandingPage/LandingPage";
import ChatWidget from "./components/ChatWidget";

export default function App() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/chat"
          element={isMobile ? <ChatPage /> : <ChatWidget />}
        />
      </Routes>
    </Router>
  );
}