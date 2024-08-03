import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import "./App.css";
import Footer from "./components/Footer";
import ScrollTop from "./components/ScrollTop";
import AdminPage from "./pages/AdminPage";
import SplashPage from "./pages/SplashPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import CoverLetter from "./pages/CoverLetterPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/listings" element={<HomePage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/cover-letter" element={<CoverLetter />} />

        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <Footer />
      <ScrollTop />
    </>
  );
}

export default App;
