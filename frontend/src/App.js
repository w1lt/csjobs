import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import "./App.css";
import Footer from "./components/Footer";
import ScrollTop from "./components/ScrollTop";
import AdminPage from "./pages/AdminPage";
import SplashPage from "./pages/SplashPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import CoverLetter from "./pages/CoverLetterPage";
import Header from "./components/Header";
import { Container } from "@mantine/core";
import AIToolsPage from "./pages/AIToolsPage";

function App() {
  return (
    <>
      <Container size="md">
        <Header />
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/listings" element={<HomePage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/cover-letter" element={<CoverLetter />} />
          <Route path="/ai" element={<AIToolsPage />} />

          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        <Footer />
      </Container>
      <ScrollTop />
    </>
  );
}

export default App;
