import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import MapAnalysis from "./pages/MapAnalysis";
import HeatMap from "./pages/HeatMap";
import AIAnalysis from "./pages/AIAnalysis";
import KnowledgeGraph from "./pages/KnowledgeGraph";
import Reports from "./pages/Reports";
import History from "./pages/History";
import Sidebar from "./components/Sidebar";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "oklch(0.10 0.018 240)" }}>
      <Sidebar />
      <main className="flex-1 overflow-auto min-w-0">
        {children}
      </main>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/map" component={MapAnalysis} />
        <Route path="/heatmap" component={HeatMap} />
        <Route path="/ai" component={AIAnalysis} />
        <Route path="/knowledge" component={KnowledgeGraph} />
        <Route path="/reports" component={Reports} />
        <Route path="/history" component={History} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster position="top-right" theme="dark" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
