import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Film, Wallet, Users, Play, ChartBar, Zap, Shield, TrendingUp, ArrowRight } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";
import HeroBackground from "@/components/HeroBackground";
import Footer from "@/components/Footer";
import tokenMintImage from "@/assets/token-mint-cinema.png";
import heritageFusionImage from "@/assets/heritage-fusion-lab.png";
import blockchainThroneImage from "@/assets/blockchain-throne.png";
import afdVideo from "@/assets/afdvid.mov";
import investorsCta from "@/assets/investors-cta.png";
import creatorSpotlight from "@/assets/creator-spotlight.png";
import culturalSovereignty from "@/assets/cultural-sovereignty.png";
import investorOpportunity from "@/assets/investor-opportunity.png";
import platformFeatures from "@/assets/platform-features.png";
import communityCta from "@/assets/community-cta.png";
import afdLogo from "@/assets/new-logo.png";

const Index = () => {
  return <div className="min-h-screen relative overflow-hidden gold-dark">
      {/* Video Background */}
      <div className="fixed inset-0 w-full h-full">
        <video src={afdVideo} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
        {/* Overlay gradients for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
      </div>
      
      <div className="container mx-auto px-4 pt-24 md:pt-40 pb-20 relative z-10">
        {/* Hero Content with Glassmorphism */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="backdrop-blur-xl border border-border/50 p-8 md:p-12 shadow-2xl bg-white/0 rounded-none">
            <div className="flex items-center justify-center mb-8">
              <img src={afdLogo} alt="African Film DAO" className="h-96 w-auto transition-all hover:scale-105" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-accent font-semibold mb-8 animate-fade-in">
              Financing the Future of African Cinema
            </h2>
            
            <p className="text-lg sm:text-xl md:text-2xl text-foreground/90 mb-10 leading-relaxed max-w-4xl animate-fade-in">
              Revolutionising the African film industry using Polygon blockchain technology to tokenize IP assets & democratise funding. Join us in this groundbreaking journey!
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 mt-10">
              <Link to="/afd" className="w-full sm:w-auto group">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground border-0 text-lg px-10 py-7 rounded-xl shadow-lg hover:shadow-primary/50 transition-all duration-300 group-hover:scale-105">
                  <Film className="w-5 h-5 mr-2" />
                  Submit Your Project
                </Button>
              </Link>
              <Link to="/marketplace" className="w-full sm:w-auto group">
                <Button size="lg" className="w-full sm:w-auto backdrop-blur-lg bg-card/40 hover:bg-card/60 text-foreground border-2 border-border hover:border-primary text-lg px-10 py-7 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-105">
                  <Play className="w-5 h-5 mr-2" />
                  Explore Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Cultural Sovereignty Banner */}
        <div className="mb-24 relative rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src={culturalSovereignty} 
            alt="Cultural Sovereignty - African stories, African control, African future" 
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        </div>
        
        {/* Challenges Section with Glassmorphism */}
        <div className="mb-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent">
                  Challenges Facing African Filmmakers
                </span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {challenges.map((challenge, index) => <Card key={index} className="group backdrop-blur-xl bg-card/40 border-2 border-border/50 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 overflow-hidden">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-secondary/20 border border-accent/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                        <div className="text-accent">
                          {challenge.icon}
                        </div>
                      </div>
                      <h3 className="font-heading text-2xl font-bold mb-4 text-foreground group-hover:text-accent transition-colors">{challenge.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-base">{challenge.description}</p>
                    </div>
                  </CardContent>
                </Card>)}
            </div>

            {/* Solutions Card */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-card/60 to-card/30 border-2 border-primary/30 rounded-3xl p-10 md:p-14 shadow-2xl">
              <h3 className="font-heading text-3xl md:text-4xl font-bold mb-10 text-center">
                <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  The African Film DAO Solution
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {solutions.map((solution, index) => <div key={index} className="flex items-start gap-5 group">
                    <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl w-12 h-12 flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-lg mb-3 group-hover:text-primary transition-colors">{solution.title}</h4>
                      <p className="text-muted-foreground leading-relaxed">{solution.description}</p>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>
        </div>

        {/* Platform Features Image Section */}
        <div className="mb-24 relative rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src={platformFeatures} 
            alt="The Platform Explained - Direct Funding, Transparent Governance, Fractional Ownership, Community Voting, Royalty Distribution, Rights Management" 
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Feature Cards with Enhanced Glassmorphism and Images */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Platform Features
              </span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => <Card key={index} className="group relative backdrop-blur-2xl bg-gradient-to-br from-card/50 to-card/20 border-2 border-border/40 hover:border-primary transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 overflow-hidden rounded-2xl">
                {/* Feature image background */}
                {feature.image && <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                    <img src={feature.image} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent"></div>
                  </div>}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-10 relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <div className="text-primary">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="font-heading text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-base">{feature.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>

        {/* Creator Spotlight Section */}
        <div className="mb-24">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
            <img 
              src={creatorSpotlight} 
              alt="Meet the Creators - Your vision, Your terms, Your community" 
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <Link to="/showcase">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-105">
                  <Users className="w-5 h-5 mr-2" />
                  Explore Filmmaker Showcase
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Community Section */}
        <div className="mb-24">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
            <img 
              src={communityCta} 
              alt="Community: Shape the Future - Your voice matters, Your vote counts" 
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <Link to="/community">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-accent/50 transition-all duration-300 hover:scale-105">
                  <Users className="w-5 h-5 mr-2" />
                  Join the Movement
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Investor Opportunity Section */}
        <div className="mb-24">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
            <img 
              src={investorOpportunity} 
              alt="Invest in African Cinema - Impact + Returns, Fractional ownership, Transparent governance" 
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <Link to="/dex">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-accent/50 transition-all duration-300 hover:scale-105">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Start Investing
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Investors CTA Section */}
        <div className="mb-24">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
            <img 
              src={investorsCta} 
              alt="Investors: Discover Opportunity - Impact, Returns, Transparency" 
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 flex flex-col sm:flex-row gap-4">
              <Link to="/marketplace">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-105">
                  <Play className="w-5 h-5 mr-2" />
                  Browse Films
                </Button>
              </Link>
              <Link to="/asset-management">
                <Button size="lg" variant="outline" className="backdrop-blur-lg bg-card/40 hover:bg-card/60 text-foreground border-2 border-border hover:border-accent text-lg px-8 py-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105">
                  <Wallet className="w-5 h-5 mr-2" />
                  Manage Assets
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-20">
          
        </div>
        
        {/* Featured content section */}
        
        {/* Market Overview Section */}
        

        <ChatInterface />
        <Footer />
      </div>
    </div>;
};

const features = [{
  icon: <Zap className="w-10 h-10" />,
  title: "Tokenized Film IP",
  description: "Transform film intellectual property into tradeable digital assets, enabling fractional ownership and investment opportunities.",
  image: tokenMintImage
}, {
  icon: <TrendingUp className="w-10 h-10" />,
  title: "Decentralized Exchange",
  description: "Trade film tokens seamlessly using our built-in DEX, powered by secure smart contracts and lightning-fast transactions.",
  image: heritageFusionImage
}, {
  icon: <Shield className="w-10 h-10" />,
  title: "Community Driven",
  description: "Join a vibrant community of filmmakers, investors, and enthusiasts shaping the future of film financing together.",
  image: blockchainThroneImage
}];

const stats = [{
  value: "$10M+",
  label: "Total Volume"
}, {
  value: "1000+",
  label: "Active Users"
}, {
  value: "500+",
  label: "Film IPs Listed"
}];

const featuredFilms = [{
  title: "The Digital Frontier",
  category: "Sci-Fi",
  poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80"
}, {
  title: "Blockchain Revolution",
  category: "Documentary",
  poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80"
}, {
  title: "Future of Finance",
  category: "Drama",
  poster: "https://images.unsplash.com/photo-1559583109-3e7968136c99?auto=format&fit=crop&q=80"
}, {
  title: "Crypto Dreams",
  category: "Thriller",
  poster: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&q=80"
}];

const challenges = [{
  icon: <Wallet className="w-8 h-8" />,
  title: "Funding Difficulties",
  description: "African filmmakers often struggle to acquire funding to support their films."
}, {
  icon: <Film className="w-8 h-8" />,
  title: "Limited Distribution",
  description: "The film industry in Africa faces obstacles including lack of infrastructure and limited distribution networks."
}, {
  icon: <ChartBar className="w-8 h-8" />,
  title: "Low Budgets",
  description: "With limited funding, filmmakers have to work with smaller budgets, which can impact film quality."
}];

const solutions = [{
  title: "Tokenization of IP Assets",
  description: "We tokenize IP assets and allow investors to purchase them on the open market."
}, {
  title: "Access NFT",
  description: "Membership NFT which allows access to our festival, pitch forum and token release."
}, {
  title: "Transparent Democratic Voting",
  description: "We use a democratic voting system where token holders choose which projects will get funding."
}, {
  title: "Polygon Blockchain Technology",
  description: "Polygon Blockchain technology ensures transparency and security in the voting process."
}];

const regulatoryPoints = ["Compliant with securities regulations for tokenized assets", "KYC/AML procedures for investor verification", "Smart contracts audited by leading security firms", "Transparent revenue distribution mechanisms", "Regular reporting and disclosure requirements"];

const marketMetrics = [{
  icon: <Film className="w-8 h-8" />,
  title: "Total Films Tokenized",
  value: "500+",
  description: "Growing catalogue of tokenized film IP assets"
}, {
  icon: <Wallet className="w-8 h-8" />,
  title: "Trading Volume",
  value: "$10M+",
  description: "Monthly trading volume on our DEX"
}, {
  icon: <Users className="w-8 h-8" />,
  title: "Active Investors",
  value: "10,000+",
  description: "Global community of film IP investors"
}];

export default Index;
