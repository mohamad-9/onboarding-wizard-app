import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Onboarding from "./pages/Onboarding";
import Admin from "./pages/Admin";
import Data from "./pages/Data";

function App() {
  return (
    <BrowserRouter>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/">Onboarding</Link> |{" "}
        <Link to="/admin">Admin</Link> |{" "}
        <Link to="/data">Data</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/data" element={<Data />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
