import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, User, Users, Building } from "lucide-react";
import { toast } from "sonner";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { switchToPolygon } from "@/integrations/contracts/filmNFT";
import { useIsMobile } from "@/hooks/use-mobile";
import afdLogo from "@/assets/new-logo.png";
import MobileBottomNav from "./MobileBottomNav";
const Navigation = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    isAdmin
  } = useAdminCheck();
  const {
    user,
    loading: authLoading
  } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  console.log("Navigation - user:", user, "authLoading:", authLoading);
  useEffect(() => {
    const checkWallet = async () => {
      if (typeof window !== 'undefined' && window.ethereum && window.ethereum.selectedAddress) {
        setAccount(window.ethereum.selectedAddress);
      }
    };
    checkWallet();
  }, []);
  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      toast.error("Please install MetaMask!");
      return;
    }
    setLoading(true);
    try {
      // First switch to Polygon network
      await switchToPolygon();

      // Then connect wallet
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      setAccount(accounts[0]);
      toast.success("Wallet connected to Polygon network!");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet or switch to Polygon network");
    }
    setLoading(false);
  };
  const disconnectWallet = () => {
    setAccount(null);
    toast.success("Wallet disconnected");
  };
  const handleLogout = async () => {
    setLoading(true);
    try {
      console.log("Attempting to sign out...");
      if (account) {
        disconnectWallet();
      }
      // Attempt server-side logout but don't block on errors
      // (session may already be expired on the server)
      await supabase.auth.signOut().catch(err => {
        console.warn("Server signOut failed (session may be expired):", err);
      });
    } catch (error) {
      console.warn("Error during logout:", error);
    } finally {
      // Always clear local state and redirect, regardless of server response
      localStorage.removeItem('user');
      toast.success("Successfully signed out");
      console.log("Successfully signed out");
      navigate('/login');
      setLoading(false);
    }
  };
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-2xl bg-afd-secondary/90 border-b-2 border-afd-primary/30 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-24">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center">
                <img src={afdLogo} alt="African Film DAO" className="h-20 w-auto transition-all hover:scale-105" />
              </Link>
              
              {/* Desktop Navigation - show on md and above */}
              <div className="hidden md:flex items-center gap-6 ml-8">
                <Link to="/marketplace" className="text-afd-primary/80 hover:text-afd-primary transition-colors font-medium">
                  Marketplace
                </Link>
                <Link to="/afd" className="text-afd-primary/80 hover:text-afd-primary transition-colors flex items-center gap-2 font-medium">
                  <Users className="w-4 h-4" />
                  AFD
                </Link>

                <a href="https://afd-stream.base44.app/Home" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-afd-primary to-afd-gold text-afd-secondary hover:shadow-lg hover:shadow-afd-primary/30 transition-all px-4 py-2 rounded-xl font-semibold text-sm">
                  AFD Stream beta
                </a>
                {isAdmin && (
                  <Link to="/admin" className="text-afd-primary/80 hover:text-afd-primary transition-colors font-medium">
                    Admin
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              
              {/* Desktop Actions - show on md and above */}
              <div className="hidden md:flex items-center gap-2">
                {user && !authLoading ? (
                  <>
                    <Link to="/profile">
                      <Button variant="ghost" size="sm" className="gap-2" aria-label="Profile">
                        <User className="w-4 h-4" />
                        <span className="hidden xl:inline">Profile</span>
                      </Button>
                    </Link>
                    <Link to="/community">
                      <Button variant="secondary" size="sm" className="gap-2" aria-label="Community">
                        <Users className="w-4 h-4" />
                        <span className="hidden xl:inline">Community</span>
                      </Button>
                    </Link>
                    <Link to="/showcase">
                      <Button variant="ghost" size="sm" className="gap-2" aria-label="Showcase">
                        <Building className="w-4 h-4" />
                        <span className="hidden xl:inline">Showcase</span>
                      </Button>
                    </Link>
                    {account ? (
                      <Button className="bg-afd-primary text-afd-secondary hover:bg-afd-primary/90 font-semibold text-sm shadow-md" onClick={disconnectWallet} disabled={loading}>
                        {shortenAddress(account)}
                      </Button>
                    ) : (
                      <Button className="bg-afd-primary text-afd-secondary hover:bg-afd-primary/90 font-semibold text-sm shadow-md" onClick={connectWallet} disabled={loading}>
                        Connect Wallet
                      </Button>
                    )}
                    <Button variant="outline" onClick={handleLogout} disabled={loading} className="font-semibold text-sm gap-2">
                      <LogOut className="w-4 h-4" />
                      <span className="hidden xl:inline">Sign Out</span>
                    </Button>
                  </>
                ) : authLoading ? (
                  <div className="w-8 h-8 animate-spin rounded-full border-2 border-afd-primary border-t-transparent"></div>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="outline" size="sm" className="font-semibold border-afd-primary text-afd-primary hover:bg-afd-primary hover:text-afd-secondary">
                        Login
                      </Button>
                    </Link>
                    <Button className="bg-afd-primary text-afd-secondary hover:bg-afd-primary/90 font-semibold text-sm shadow-md" onClick={connectWallet} disabled={loading}>
                      Connect Wallet
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        account={account}
        onConnectWallet={connectWallet}
        onDisconnectWallet={disconnectWallet}
        loading={loading}
      />
    </>
  );
};

export default Navigation;