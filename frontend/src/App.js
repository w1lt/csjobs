import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import "./App.css";
import Footer from "./components/Footer";
import ScrollTop from "./components/ScrollTop";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <Footer />
      <ScrollTop />
    </>
  );
}

export default App;
