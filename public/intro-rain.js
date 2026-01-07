/**
 * Standalone Matrix-style Sudoku Intro Rain Animation
 * Pure JavaScript implementation for non-React usage
 * 
 * Usage:
 * <script src="intro-rain.js"></script>
 * <script>
 *   window.SudokuIntroRain.init({
 *     density: 0.6,
 *     titleDelay: 2500,
 *     autoEnter: 6000,
 *     onEnter: () => window.location.href = '/home'
 *   });
 * </script>
 */

(function(window) {
  'use strict';
  
  const DEFAULT_CONFIG = {
    density: 0.6,
    speedMin: 1,
    speedMax: 4,
    brightChance: 0.12,
    titleDelay: 2500,
    autoEnter: Infinity,
    color: '#8fe7a8',
    onEnter: () => window.location.href = '/home'
  };
  
  const SUDOKU_CHARS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const FONT_SIZE = 16;
  
  let canvas, ctx, drops = [], config, clicked = false;
  let animationFrame, titleTimer, autoTimer;
  
  function createDrop(canvasWidth, canvasHeight) {
    const columns = Math.floor(canvasWidth / FONT_SIZE);
    const x = Math.floor(Math.random() * columns) * FONT_SIZE;
    const speed = config.speedMin + Math.random() * (config.speedMax - config.speedMin);
    const length = Math.floor(10 + Math.random() * 20);
    const chars = Array.from({ length }, () => 
      SUDOKU_CHARS[Math.floor(Math.random() * SUDOKU_CHARS.length)]
    );
    
    return {
      x,
      y: -length * FONT_SIZE - Math.random() * canvasHeight,
      speed,
      length,
      chars,
      opacity: 0.3 + Math.random() * 0.7,
      isBright: Math.random() < config.brightChance
    };
  }
  
  function initDrops() {
    const columns = Math.floor(canvas.width / FONT_SIZE);
    const activeColumns = Math.floor(columns * config.density);
    drops = [];
    
    for (let i = 0; i < activeColumns; i++) {
      drops.push(createDrop(canvas.width, canvas.height));
    }
  }
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initDrops();
  }
  
  function animate(currentTime) {
    if (clicked) return;
    
    // Clear with fade
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = `${FONT_SIZE}px monospace`;
    
    // Draw drops
    drops.forEach(drop => {
      for (let i = 0; i < drop.chars.length; i++) {
        const charY = drop.y + i * FONT_SIZE;
        
        if (charY > 0 && charY < canvas.height) {
          const isHead = i === 0;
          const alpha = isHead 
            ? (drop.isBright ? 1.0 : 0.9) 
            : drop.opacity * (1 - i / drop.chars.length);
          
          if (isHead && drop.isBright) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = config.color;
          } else {
            ctx.shadowBlur = 0;
          }
          
          const lightness = isHead ? (drop.isBright ? '85%' : '70%') : `${40 - i * 2}%`;
          ctx.fillStyle = `hsla(145, 60%, ${lightness}, ${alpha})`;
          ctx.fillText(drop.chars[i], drop.x, charY);
        }
      }
      
      drop.y += drop.speed;
      
      if (drop.y - drop.length * FONT_SIZE > canvas.height) {
        drop.y = -drop.length * FONT_SIZE;
        drop.chars = Array.from({ length: drop.length }, () => 
          SUDOKU_CHARS[Math.floor(Math.random() * SUDOKU_CHARS.length)]
        );
        if (Math.random() < 0.1) {
          drop.opacity = 0.3 + Math.random() * 0.7;
        }
      }
    });
    
    ctx.shadowBlur = 0;
    animationFrame = requestAnimationFrame(animate);
  }
  
  function showTitle() {
    const titleContainer = document.createElement('div');
    titleContainer.id = 'sudoku-intro-title';
    titleContainer.style.cssText = `
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 10000;
      opacity: 0;
      transform: scale(0.95);
      transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    `;
    
    titleContainer.innerHTML = `
      <div style="text-align: center; padding: 0 1rem;">
        <h1 style="
          font-size: 4rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: ${config.color};
          text-shadow: 0 0 20px ${config.color}80, 0 0 40px ${config.color}40;
          filter: blur(8px);
          transition: filter 0.6s ease-out;
        ">Sudoku</h1>
        <p style="
          font-size: 1.5rem;
          color: #d1d5db;
          font-weight: 300;
          letter-spacing: 0.1em;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
          filter: blur(6px);
          transition: filter 0.6s ease-out 0.1s;
        ">Test Your Limits</p>
        <p style="
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 2rem;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        ">Click anywhere to enter</p>
      </div>
    `;
    
    document.body.appendChild(titleContainer);
    
    // Trigger animation
    setTimeout(() => {
      titleContainer.style.opacity = '1';
      titleContainer.style.transform = 'scale(1)';
      
      const h1 = titleContainer.querySelector('h1');
      const p = titleContainer.querySelector('p');
      setTimeout(() => {
        h1.style.filter = 'blur(0)';
        p.style.filter = 'blur(0)';
      }, 200);
    }, 50);
  }
  
  function handleClick() {
    if (clicked) return;
    clicked = true;
    
    // Cancel timers
    clearTimeout(titleTimer);
    clearTimeout(autoTimer);
    if (animationFrame) cancelAnimationFrame(animationFrame);
    
    // Fade out
    const container = document.getElementById('sudoku-intro-container');
    if (container) {
      container.style.transition = 'opacity 0.5s ease-out';
      container.style.opacity = '0';
    }
    
    setTimeout(() => {
      if (config.onEnter) config.onEnter();
    }, 500);
  }
  
  function init(userConfig = {}) {
    config = { ...DEFAULT_CONFIG, ...userConfig };
    
    // Create container
    const container = document.createElement('div');
    container.id = 'sudoku-intro-container';
    container.style.cssText = `
      position: fixed;
      inset: 0;
      background: black;
      cursor: pointer;
      overflow: hidden;
      z-index: 9999;
    `;
    
    // Create canvas
    canvas = document.createElement('canvas');
    canvas.style.cssText = 'display: block; width: 100%; height: 100%;';
    container.appendChild(canvas);
    
    document.body.appendChild(container);
    container.addEventListener('click', handleClick);
    
    // Setup canvas
    ctx = canvas.getContext('2d', { alpha: false });
    resize();
    window.addEventListener('resize', resize);
    
    // Start animation
    animationFrame = requestAnimationFrame(animate);
    
    // Title timer
    titleTimer = setTimeout(showTitle, config.titleDelay);
    
    // Auto-enter timer (only if configured)
    if (config.autoEnter !== Infinity && config.autoEnter > 0) {
      autoTimer = setTimeout(() => {
        if (!clicked) handleClick();
      }, config.autoEnter);
    }
  }
  
  function destroy() {
    clicked = true;
    clearTimeout(titleTimer);
    clearTimeout(autoTimer);
    if (animationFrame) cancelAnimationFrame(animationFrame);
    window.removeEventListener('resize', resize);
    
    const container = document.getElementById('sudoku-intro-container');
    const title = document.getElementById('sudoku-intro-title');
    if (container) container.remove();
    if (title) title.remove();
  }
  
  // Export API
  window.SudokuIntroRain = {
    init,
    destroy
  };
  
})(window);
