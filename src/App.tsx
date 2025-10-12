import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Vehicles from "./pages/Vehicles";
import Drivers from "./pages/Drivers";
import Maintenance from "./pages/Maintenance";
import Fuel from "./pages/Fuel";
import Documents from "./pages/Documents";
import Tours from "./pages/Tours";
import Inspections from "./pages/Inspections";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/fuel" element={<Fuel />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/inspections" element={<Inspections />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
