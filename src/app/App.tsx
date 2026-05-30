import { BrowserRouter, Routes, Route } from "react-router";
import { ThemeProvider } from "./components/theme-provider";
import { Sidebar } from "./components/sidebar";
import { DashboardPage } from "./pages/dashboard";
import { DetectionPage } from "./pages/detection";
import { ResultsPage } from "./pages/results";
import { PerformancePage } from "./pages/performance";
import { HistoryPage } from "./pages/history";
import { SettingsPage } from "./pages/settings";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="flex h-screen overflow-hidden bg-background">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-6 lg:p-8">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/detection" element={<DetectionPage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/performance" element={<PerformancePage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </div>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}