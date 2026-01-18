import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import CustomerRegistration from "./pages/CustomerRegistration";
import ServicesPage from "./pages/ServicesPage";
import GroceriesPage from "./pages/services/GroceriesPage";
import BurialPage from "./pages/services/BurialPage";
import SavingsPage from "./pages/services/SavingsPage";
import InvestmentsPage from "./pages/services/InvestmentsPage";
import CrowdfundingPage from "./pages/services/CrowdfundingPage";
import FunDayPage from "./pages/fun/FunDayPage";
import DoOrDiePage from "./pages/fun/DoOrDiePage";
import ConstitutionPage from "./pages/ConstitutionPage";
import BenefitsPage from "./pages/BenefitsPage";
import ContactPage from "./pages/ContactPage";
import MarketplacePage from "./pages/MarketplacePage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AgentRegistration from "./pages/AgentRegistration";
import AgentDashboard from "./pages/AgentDashboard";
import AgentsAdmin from "./pages/AgentsAdmin";
import NotFound from "./pages/NotFound";
import TabbedDemo from "./pages/TabbedDemo";
import { AIChatbot } from "./components/AIChatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/register" element={<CustomerRegistration />} />
          
          {/* Stokvel Services */}
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/groceries" element={<GroceriesPage />} />
          <Route path="/services/burial" element={<BurialPage />} />
          <Route path="/services/savings" element={<SavingsPage />} />
          <Route path="/services/investments" element={<InvestmentsPage />} />
          <Route path="/services/crowdfunding" element={<CrowdfundingPage />} />
          
          {/* Fun & Games */}
          <Route path="/fun/funday" element={<FunDayPage />} />
          <Route path="/fun/doordie" element={<DoOrDiePage />} />
          
          {/* Other Pages */}
          <Route path="/constitution" element={<ConstitutionPage />} />
          <Route path="/benefits" element={<BenefitsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          
          {/* Admin & Agent */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/agents" element={<AgentsAdmin />} />
          <Route path="/agent" element={<AgentRegistration />} />
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
          <Route path="/tabs-demo" element={<TabbedDemo />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AIChatbot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
