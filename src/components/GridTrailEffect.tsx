import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  alpha: number;
}

const GridTrailEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const points = useRef<Point[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const POINT_SPACING = 50;
  const TRAIL_LENGTH = 8;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const initializePoints = () => {
      points.current = [];
      const rows = Math.ceil(window.innerHeight / POINT_SPACING);
      const cols = Math.ceil(window.innerWidth / POINT_SPACING);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          points.current.push({
            x: x * POINT_SPACING,
            y: y * POINT_SPACING,
            alpha: 0.3,
          });
        }
      }
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializePoints();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';

      points.current.forEach((point) => {
        const dx = mouse.current.x - point.x;
        const dy = mouse.current.y - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = POINT_SPACING * TRAIL_LENGTH;

        if (distance < maxDistance) {
          point.alpha = 1 - (distance / maxDistance);
        } else {
          point.alpha = 0.3;
        }

        ctx.globalAlpha = point.alpha;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default GridTrailEffect;