import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DocsPage from "./pages/DocsPage";
import DemoPage from "./pages/DemoPage";
import ResolutionViz from "./pages/ResolutionViz";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full bg-base-100">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/app" element={<ResolutionViz />} />

          {/* Unknown routes return to the root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;