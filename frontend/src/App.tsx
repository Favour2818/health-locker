import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import MainLayout from "./layouts/MainLayout.js";
import { initializeFheInstance } from "./lib/fhevm.js"; // adjust path if needed
import Home from "./pages/Home.js";
import Dashboard from "./pages/Dashboard.js";

function App() {
   useEffect(() => {
    initializeFheInstance().then(() => {
      console.log("🔐 FHEVM initialized successfully");
    });
  }, []);
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </MainLayout>
  );
}

export default App;