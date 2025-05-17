
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletContextProvider } from "./context/WalletContextProvider";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import AIAgent from "./pages/AIAgent";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Learn from "./pages/Learn";
import Loans from "./pages/Loans";
import DAO from "./pages/DAO";
import NewLoan from "./pages/NewLoan";

const App = () => {
  // Create a new QueryClient instance inside the component function
  // This ensures proper hook context
  const queryClient = new QueryClient();
  
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <WalletContextProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/ai-agent" element={<AIAgent />} />
              <Route path="/about" element={<About />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/loans" element={<Loans />} />
              <Route path="/new-loan" element={<NewLoan />} />
              <Route path="/dao" element={<DAO />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </WalletContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
