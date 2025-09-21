import React, { useEffect, useRef } from "react";

function VortexBackground({ particleCount = 900 }) {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const particles = useRef([]);

  const randRange = (n) => n - Math.random() * 2 * n;
  const fadeInOut = (t, m) => Math.abs(((t + 0.5 * m) % m) - 0.5 * m) / (0.5 * m);

  const initParticles = (width, height) => {
    particles.current = [];
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = height / 2 + randRange(100);
      const angle = Math.random() * 2 * Math.PI;
      const speed = 0.05 ;
      const radius = 4 + Math.random() * 2;
      const ttl = 50 + Math.random() * 150;
      particles.current.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 0, ttl, radius });
    }
  };

  const draw = (ctx, width, height) => {
    ctx.fillStyle = "#000000"; // background
    ctx.fillRect(0, 0, width, height);

    for (let p of particles.current) {
      const alpha = fadeInOut(p.life, p.ttl);
      ctx.beginPath();
      ctx.strokeStyle = `rgba(70,150,255,${alpha})`;
      ctx.lineWidth = p.radius;
      ctx.moveTo(p.x, p.y);
      p.x += p.vx;
      p.y += p.vy;
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      ctx.closePath();

      p.life++;
      if (p.life > p.ttl || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
        p.x = Math.random() * width;
        p.y = height / 2 + randRange(100);
        const angle = Math.random() * 2 * Math.PI;
        const speed = 0.5 + Math.random();
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
        p.life = 0;
        p.ttl = 50 + Math.random() * 150;
        p.radius = 1 + Math.random() * 2;
      }
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    draw(ctx, width, height);
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles(canvas.width, canvas.height);
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas
  ref={canvasRef}
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -10, // was -1
    pointerEvents: "none",
  }}
/>

}

export default VortexBackground;
