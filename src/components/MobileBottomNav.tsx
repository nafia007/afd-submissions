import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, Users, Tv, MoreHorizontal, User, Building, LogOut, Wallet, Vote } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface MobileBottomNavProps {
  account: string | null;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  loading: boolean;
}

const MobileBottomNav = ({ account, onConnectWallet, onDisconnectWallet, loading }: MobileBottomNavProps) => {
  const location = useLocation();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      if (account) {
        onDisconnectWallet();
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
      navigate('/login');
      setMoreMenuOpen(false);
    }
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/marketplace", icon: ShoppingBag, label: "Market" },
    { path: "/afd", icon: Users, label: "AFD" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border safe-area-bottom md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
              isActive(item.path)
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}

        {/* AFD Stream - External Link */}
        <a
          href="https://afd-stream.base44.app/Home"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Tv className="w-5 h-5" />
          <span className="text-[10px] font-medium">Stream</span>
        </a>

        {/* More Menu */}
        <Sheet open={moreMenuOpen} onOpenChange={setMoreMenuOpen}>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <MoreHorizontal className="w-5 h-5" />
              <span className="text-[10px] font-medium">More</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl max-h-[70vh]">
            <div className="pt-2 pb-6 space-y-2">
              <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-6" />
              
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMoreMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium">Profile</span>
                  </Link>

                  <Link
                    to="/community"
                    onClick={() => setMoreMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center">
                      <Users className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <span className="font-medium">Community</span>
                  </Link>

                  <Link
                    to="/voting"
                    onClick={() => setMoreMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Vote className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="font-medium">Voting</span>
                  </Link>

                  <Link
                    to="/showcase"
                    onClick={() => setMoreMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <Building className="w-5 h-5 text-accent" />
                    </div>
                    <span className="font-medium">Showcase</span>
                  </Link>

                  <div className="border-t border-border my-4" />

                  {account ? (
                    <button
                      onClick={() => {
                        onDisconnectWallet();
                        setMoreMenuOpen(false);
                      }}
                      disabled={loading}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted transition-colors w-full"
                    >
                      <div className="w-10 h-10 rounded-full bg-accent/30 flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-accent" />
                      </div>
                      <span className="font-medium">{shortenAddress(account)}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onConnectWallet();
                        setMoreMenuOpen(false);
                      }}
                      disabled={loading}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted transition-colors w-full"
                    >
                      <div className="w-10 h-10 rounded-full bg-accent/30 flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-accent" />
                      </div>
                      <span className="font-medium">Connect Wallet</span>
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-destructive/10 transition-colors w-full text-destructive"
                  >
                    <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMoreMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium">Login</span>
                  </Link>

                  <button
                    onClick={() => {
                      onConnectWallet();
                      setMoreMenuOpen(false);
                    }}
                    disabled={loading}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted transition-colors w-full"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent/30 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-accent" />
                    </div>
                    <span className="font-medium">Connect Wallet</span>
                  </button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
