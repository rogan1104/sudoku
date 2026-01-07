import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface IntroRainConfig {
  density?: number;
  speedMin?: number;
  speedMax?: number;
  brightChance?: number;
  titleDelay?: number;
  autoEnter?: number;
  color?: string;
  targetRoute?: string;
}

interface Drop {
  x: number;
  y: number;
  speed: number;
  length: number;
  chars: string[];
  opacity: number;
  isBright: boolean;
}

const DEFAULT_CONFIG: Required<IntroRainConfig> = {
  density: 0.6,
  speedMin: 1,
  speedMax: 4,
  brightChance: 0.12,
  titleDelay: 2500,
  autoEnter: Infinity,
  color: '#8fe7a8',
  targetRoute: '/home'
};

export const IntroRain = (props: IntroRainConfig = {}) => {
  const config = { ...DEFAULT_CONFIG, ...props };
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const [showTitle, setShowTitle] = useState(false);
  const [titleOpacity, setTitleOpacity] = useState(0);
  const animationFrameRef = useRef<number>();
  const dropsRef = useRef<Drop[]>([]);
  const clickedRef = useRef(false);
  
  const SUDOKU_CHARS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const FONT_SIZE = 16;
  
  const handleClick = () => {
    if (clickedRef.current) return;
    clickedRef.current = true;
    
    // Fade out and navigate
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.transition = 'opacity 0.5s ease-out';
      canvas.style.opacity = '0';
    }
    
    setTimeout(() => {
      navigate(config.targetRoute);
    }, 500);
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    
    // Setup canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initDrops();
    };
    
    const initDrops = () => {
      const columns = Math.floor(canvas.width / FONT_SIZE);
      const activeColumns = Math.floor(columns * config.density);
      dropsRef.current = [];
      
      for (let i = 0; i < activeColumns; i++) {
        const x = Math.floor(Math.random() * columns) * FONT_SIZE;
        const speed = config.speedMin + Math.random() * (config.speedMax - config.speedMin);
        const length = Math.floor(10 + Math.random() * 20);
        const chars = Array.from({ length }, () => 
          SUDOKU_CHARS[Math.floor(Math.random() * SUDOKU_CHARS.length)]
        );
        
        dropsRef.current.push({
          x,
          y: -length * FONT_SIZE - Math.random() * canvas.height,
          speed,
          length,
          chars,
          opacity: 0.3 + Math.random() * 0.7,
          isBright: Math.random() < config.brightChance
        });
      }
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    // Animation loop
    let lastTime = 0;
    const animate = (currentTime: number) => {
      if (clickedRef.current) return;
      
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      // Clear with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = `${FONT_SIZE}px monospace`;
      
      // Draw and update drops
      dropsRef.current.forEach((drop) => {
        // Draw each character in the drop
        for (let i = 0; i < drop.chars.length; i++) {
          const charY = drop.y + i * FONT_SIZE;
          
          if (charY > 0 && charY < canvas.height) {
            const isHead = i === 0;
            const alpha = isHead 
              ? (drop.isBright ? 1.0 : 0.9) 
              : drop.opacity * (1 - i / drop.chars.length);
            
            // Glow effect for bright heads
            if (isHead && drop.isBright) {
              ctx.shadowBlur = 10;
              ctx.shadowColor = config.color;
            } else {
              ctx.shadowBlur = 0;
            }
            
            // Color gradient: head is brighter
            const lightness = isHead ? (drop.isBright ? '85%' : '70%') : `${40 - i * 2}%`;
            ctx.fillStyle = `hsla(145, 60%, ${lightness}, ${alpha})`;
            
            ctx.fillText(drop.chars[i], drop.x, charY);
          }
        }
        
        // Update position
        drop.y += drop.speed * (deltaTime / 16);
        
        // Reset if completely off screen
        if (drop.y - drop.length * FONT_SIZE > canvas.height) {
          drop.y = -drop.length * FONT_SIZE;
          drop.chars = Array.from({ length: drop.length }, () => 
            SUDOKU_CHARS[Math.floor(Math.random() * SUDOKU_CHARS.length)]
          );
          // Occasionally randomize character visibility
          if (Math.random() < 0.1) {
            drop.opacity = 0.3 + Math.random() * 0.7;
          }
        }
      });
      
      ctx.shadowBlur = 0;
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    // Title reveal timer
    const titleTimer = setTimeout(() => {
      setShowTitle(true);
      // Animate title opacity
      let opacity = 0;
      const fadeIn = setInterval(() => {
        opacity += 0.05;
        setTitleOpacity(Math.min(opacity, 1));
        if (opacity >= 1) clearInterval(fadeIn);
      }, 30);
    }, config.titleDelay);
    
    // Auto-enter timer (only if configured)
    let autoTimer: NodeJS.Timeout | undefined;
    if (config.autoEnter !== Infinity && config.autoEnter > 0) {
      autoTimer = setTimeout(() => {
        if (!clickedRef.current) {
          handleClick();
        }
      }, config.autoEnter);
    }
    
    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearTimeout(titleTimer);
      if (autoTimer) clearTimeout(autoTimer);
    };
  }, [config, navigate]);
  
  return (
    <div 
      className="fixed inset-0 bg-black cursor-pointer overflow-hidden"
      onClick={handleClick}
      style={{ zIndex: 9999 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />
      
      {showTitle && (
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ 
            opacity: titleOpacity,
            transform: `scale(${0.95 + titleOpacity * 0.05})`,
            transition: 'transform 0.6s ease-out'
          }}
        >
          <div className="text-center px-4">
            <h1 
              className="text-5xl md:text-7xl font-bold mb-4"
              style={{
                color: config.color,
                textShadow: `0 0 20px ${config.color}80, 0 0 40px ${config.color}40`,
                filter: titleOpacity < 0.8 ? 'blur(8px)' : `blur(${(1 - titleOpacity) * 8}px)`,
                transition: 'filter 0.6s ease-out'
              }}
            >
              Sudoku
            </h1>
            <p 
              className="text-xl md:text-2xl text-gray-300 font-light tracking-wide"
              style={{
                textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
                filter: titleOpacity < 0.8 ? 'blur(6px)' : `blur(${(1 - titleOpacity) * 6}px)`,
                transition: 'filter 0.6s ease-out 0.1s'
              }}
            >
              Test Your Limits
            </p>
            <p 
              className="text-sm text-gray-500 mt-8 animate-pulse"
              style={{
                opacity: titleOpacity
              }}
            >
              Click anywhere to enter
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntroRain;
