import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Users, Vote, Calendar, Gift, Coins, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { switchToPolygon, getFilmMinterContract } from "@/integrations/contracts/filmNFT";
import { ethers } from "ethers";

const MintNFT = () => {
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      toast.error("Please install MetaMask to continue!");
      return;
    }

    setLoading(true);
    try {
      await switchToPolygon();
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      setAccount(accounts[0]);
      toast.success("Wallet connected to Polygon network!");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet");
    }
    setLoading(false);
  };

  const mintNFT = async () => {
    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // AFD NFT Contract Address
      const AFD_NFT_CONTRACT = "0xbf696d2efcf7c216276d4c8ce332bb60f7f345ff";
      
      // Basic ERC721 ABI for minting
      const afdNftAbi = [
        "function mint(address to) public",
        "function safeMint(address to) public",
        "function publicMint() public",
        "function totalSupply() public view returns (uint256)",
        "function balanceOf(address owner) public view returns (uint256)"
      ];
      
      const contract = new ethers.Contract(AFD_NFT_CONTRACT, afdNftAbi, signer);
      
      toast.info("Initiating NFT mint transaction...");
      
      // Try different minting methods based on common patterns
      let tx;
      try {
        // Try public mint first (most common)
        tx = await contract.publicMint();
      } catch (error) {
        try {
          // Try mint with address parameter
          tx = await contract.mint(account);
        } catch (error2) {
          // Try safeMint
          tx = await contract.safeMint(account);
        }
      }
      
      toast.info("Transaction submitted! Waiting for confirmation...");
      await tx.wait();
      
      toast.success("🎉 AFD Membership NFT minted successfully!");
      
    } catch (error: any) {
      console.error("Error minting NFT:", error);
      if (error.message?.includes("user rejected")) {
        toast.error("Transaction cancelled by user");
      } else if (error.message?.includes("insufficient funds")) {
        toast.error("Insufficient funds for gas fees");
      } else {
        toast.error("Failed to mint NFT. Please try again.");
      }
    }
    setLoading(false);
  };

  const membershipBenefits = [
    {
      icon: <Users className="w-5 h-5 text-primary" />,
      title: "Film Pitching Access",
      description: "Submit and pitch your film projects to the AFD community"
    },
    {
      icon: <Vote className="w-5 h-5 text-primary" />,
      title: "Voting Rights",
      description: "Vote on film submissions and community decisions"
    },
    {
      icon: <Calendar className="w-5 h-5 text-primary" />,
      title: "Exclusive Events",
      description: "Access to AFD workshops, screenings, and networking events"
    },
    {
      icon: <Gift className="w-5 h-5 text-primary" />,
      title: "Airdrops & Rewards",
      description: "Receive exclusive NFT airdrops and community rewards"
    },
    {
      icon: <Coins className="w-5 h-5 text-primary" />,
      title: "Resource Library",
      description: "Access to filmmaking resources, templates, and guides"
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gradient-to-br from-background via-background to-background/50">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Mint Your AFD Membership NFT
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock exclusive access to the African Film DAO ecosystem with your membership NFT
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Minting Section */}
          <Card className="border-primary/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-6 h-6 text-primary" />
                Mint Your NFT
              </CardTitle>
              <CardDescription>
                Connect your MetaMask wallet and mint your AFD membership NFT on Polygon
                <br />
                <span className="text-xs text-muted-foreground">Contract: 0xbf696d...f345ff</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Step 1: Install MetaMask</span>
                  <a 
                    href="https://metamask.io/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-auto"
                  >
                    <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-primary" />
                  </a>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Step 2: Connect to Polygon Network</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                  <span className="text-sm">Step 3: Mint Your NFT</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                {!account ? (
                  <Button 
                    onClick={connectWallet} 
                    disabled={loading}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? "Connecting..." : "Connect MetaMask Wallet"}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Wallet Connected: {account.slice(0, 6)}...{account.slice(-4)}
                      </p>
                    </div>
                    <Button 
                      onClick={mintNFT} 
                      disabled={loading}
                      className="w-full"
                      size="lg"
                    >
                      {loading ? "Minting..." : "Mint AFD Membership NFT"}
                    </Button>
                  </div>
                )}
              </div>

              <div className="text-center">
                <Badge variant="secondary" className="text-xs">
                  Minting on Polygon Network • Gas fees ~$0.01
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Benefits Section */}
          <Card className="border-accent/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-6 h-6 text-accent" />
                Membership Benefits
              </CardTitle>
              <CardDescription>
                Your NFT unlocks exclusive access to the AFD ecosystem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {membershipBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    {benefit.icon}
                    <div>
                      <h4 className="font-semibold text-sm">{benefit.title}</h4>
                      <p className="text-xs text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Community Access</h3>
              <p className="text-sm text-muted-foreground">
                Join a vibrant community of African filmmakers and creatives
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Vote className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Governance Power</h3>
              <p className="text-sm text-muted-foreground">
                Shape the future of African cinema through democratic voting
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Coins className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Exclusive Perks</h3>
              <p className="text-sm text-muted-foreground">
                Access premium features, events, and rewards
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MintNFT;