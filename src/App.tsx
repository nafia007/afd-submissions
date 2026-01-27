import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import Dex from "./pages/Dex";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import FilmDetails from "./pages/FilmDetails";
import FilmAssetsDashboard from "./pages/FilmAssetsDashboard";
import AssetManagement from "./pages/AssetManagement";
import CreatorDashboard from "./pages/CreatorDashboard";
import FilmSubmission from "./pages/FilmSubmission";
import AFD from "./pages/AFD";
import Analytics from "./pages/Analytics";
import AdminDashboard from "./pages/AdminDashboard";
import MintNFT from "./pages/MintNFT";
import FilmmakerShowcase from "./pages/FilmmakerShowcase";
import Install from "./pages/Install";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Voting from "./pages/Voting";
import AdminVoting from "./pages/AdminVoting";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <ErrorBoundary>
            <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
              <BrowserRouter>
                <Navigation />
                <main className="relative">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/film/:id" element={<FilmDetails />} />
                    <Route path="/film-submission" element={<FilmSubmission />} />
                    <Route path="/dex" element={<Dex />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/creator-dashboard" element={<CreatorDashboard />} />
                    <Route path="/assets" element={<FilmAssetsDashboard />} />
                    <Route path="/asset-management" element={<AssetManagement />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/afd" element={<AFD />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/voting" element={<AdminVoting />} />
                    <Route path="/voting" element={<Voting />} />
                    <Route path="/mint-nft" element={<MintNFT />} />
                    <Route path="/showcase" element={<FilmmakerShowcase />} />
                    <Route path="/install" element={<Install />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="*" element={<Index />} />
                  </Routes>
                </main>
                <Footer />
              </BrowserRouter>
            </div>
          </ErrorBoundary>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
