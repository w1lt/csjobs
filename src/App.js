import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import "./App.css";
import Footer from "./components/Footer";
import TodoPage from "./pages/TodoPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/todo" element={<TodoPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
