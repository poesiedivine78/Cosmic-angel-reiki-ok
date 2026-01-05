
import React, { useEffect, useRef } from 'react';

const NebulaBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / width) - 0.5,
        y: (e.clientY / height) - 0.5
      };
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();

    const stars: { x: number; y: number; size: number; speed: number; opacity: number, parallax: number }[] = [];
    for (let i = 0; i < 400; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.05 + 0.01,
        opacity: Math.random(),
        parallax: Math.random() * 40 + 10
      });
    }

    const shootingStars: { x: number; y: number; len: number; speed: number; opacity: number }[] = [];
    const createShootingStar = () => {
      shootingStars.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.5,
        len: Math.random() * 100 + 50,
        speed: Math.random() * 10 + 5,
        opacity: 1
      });
    };

    const clouds = [
      { x: 0.2, y: 0.3, r: 600, color: 'rgba(139, 92, 246, 0.08)' },
      { x: 0.8, y: 0.6, r: 800, color: 'rgba(59, 130, 246, 0.06)' },
      { x: 0.5, y: 0.5, r: 1000, color: 'rgba(192, 132, 252, 0.04)' }
    ];

    const render = () => {
      ctx.fillStyle = '#010411';
      ctx.fillRect(0, 0, width, height);

      // Clouds
      clouds.forEach(cloud => {
        const cx = (cloud.x * width) + (mouseRef.current.x * 40);
        const cy = (cloud.y * height) + (mouseRef.current.y * 40);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, cloud.r);
        g.addColorStop(0, cloud.color);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
      });

      // Regular Stars
      stars.forEach(star => {
        const sx = (star.x + (mouseRef.current.x * star.parallax)) % width;
        const sy = (star.y + (mouseRef.current.y * star.parallax)) % height;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * (0.3 + Math.sin(Date.now() * 0.001) * 0.7)})`;
        ctx.beginPath();
        ctx.arc(sx < 0 ? sx + width : sx, sy < 0 ? sy + height : sy, star.size, 0, Math.PI * 2);
        ctx.fill();

        star.y -= star.speed;
        if (star.y < 0) star.y = height;
      });

      // Shooting Stars
      if (Math.random() < 0.01) createShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        ctx.strokeStyle = `rgba(192, 132, 252, ${s.opacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + s.len, s.y + s.len * 0.5);
        ctx.stroke();

        s.x += s.speed;
        s.y += s.speed * 0.5;
        s.opacity -= 0.02;
        if (s.opacity <= 0) shootingStars.splice(i, 1);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 -z-20 w-full h-full pointer-events-none" />;
};

export default NebulaBackground;
