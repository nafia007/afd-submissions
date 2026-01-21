
import { useEffect, useState } from 'react';
import heroImage from '@/assets/hero-afrofuturistic.png';

const HeroBackground = () => {
  const [loaded, setLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  useEffect(() => {
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => {
      setImageError(true);
      setLoaded(true);
    };
    img.src = heroImage;
  }, []);

  return (
    <div className="absolute inset-0 w-full h-screen overflow-hidden">
      {/* Enhanced gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background z-10"></div>
      
      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_100%)] z-10"></div>
      
      {/* Hero image with animation */}
      <div className={`absolute inset-0 transition-all duration-1500 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}>
        {!imageError ? (
          <img 
            src={heroImage}
            className="w-full h-full object-cover object-center animate-fade-in"
            alt="Afrofuturistic African Film DAO Hub"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[hsl(268,36%,8%)] via-[hsl(180,100%,27%)] to-[hsl(268,36%,17%)]"></div>
        )}
      </div>
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 opacity-40 z-10">
        <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] rounded-full bg-primary/30 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] rounded-full bg-secondary/30 blur-[120px] animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-[40%] right-[20%] w-[400px] h-[400px] rounded-full bg-accent/20 blur-[100px] animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
    </div>
  );
};

export default HeroBackground;
