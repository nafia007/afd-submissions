import { useEffect, useRef } from 'react';

const ThreeDScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createShape = () => {
      const shape = document.createElement('div');
      const size = Math.random() * 100 + 50; // Random size between 50-150px
      
      shape.className = `
        absolute opacity-20
        border border-accent/30 rounded-full
        animate-float
      `;
      
      shape.style.width = `${size}px`;
      shape.style.height = `${size}px`;
      shape.style.left = `${Math.random() * 100}%`;
      shape.style.top = `${Math.random() * 100}%`;
      shape.style.animationDelay = `${Math.random() * 5}s`;
      shape.style.transform = `scale(${Math.random() * 0.5 + 0.5})`; // Random scale
      
      container.appendChild(shape);

      setTimeout(() => {
        shape.remove();
      }, 6000);
    };

    // Create initial shapes
    for (let i = 0; i < 8; i++) {
      createShape();
    }

    // Create new shapes periodically
    const interval = setInterval(createShape, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
    />
  );
};

export default ThreeDScene;