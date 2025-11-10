"use client";
import React, { useRef, useEffect } from "react";

export const PixelatedCanvas = ({
  src,
  width = 300,
  height = 300,
  cellSize = 4,
  dotScale = 0.9,
  shape = "square",
  backgroundColor = "#000",
  grayscale = false,
  tintColor = "#fff",
  tintStrength = 0.2,
  interactive = true,
  distortionStrength = 3,
  distortionRadius = 80,
  distortionMode = "swirl",
  followSpeed = 0.2,
  jitterStrength = 2,
  jitterSpeed = 2,
  fadeOnLeave = true,
  maxFps = 60,
  responsive = true,
  objectFit = "cover",
  className,
}) => {
  const canvasRef = useRef(null);
  const samplesRef = useRef([]);
  const dimsRef = useRef({ width, height });
  const targetMouse = useRef({ x: -9999, y: -9999 });
  const animMouse = useRef({ x: -9999, y: -9999 });
  const pointerInside = useRef(false);
  const activity = useRef(0);
  const activityTarget = useRef(0);
  const rafRef = useRef(null);
  const lastFrame = useRef(0);

  useEffect(() => {
    if (!src) return; // don't continue if no image

    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    // Ensure image is loaded before any drawing
    const handleLoad = () => {
      computeSamples();
      draw();
    };

    const handleError = () => {
      console.error("PixelatedCanvas: failed to load image", src);
    };

    img.onload = handleLoad;
    img.onerror = handleError;

    const computeSamples = () => {
      if (!canvas || !img.complete || img.naturalWidth === 0) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const displayWidth = width || img.naturalWidth;
      const displayHeight = height || img.naturalHeight;
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      const off = document.createElement("canvas");
      off.width = displayWidth;
      off.height = displayHeight;
      const offCtx = off.getContext("2d");
      if (!offCtx) return;

      // compute image placement
      let dw = displayWidth, dh = displayHeight, dx = 0, dy = 0;
      if (objectFit === "cover") {
        const scale = Math.max(displayWidth / img.naturalWidth, displayHeight / img.naturalHeight);
        dw = img.naturalWidth * scale;
        dh = img.naturalHeight * scale;
        dx = (displayWidth - dw) / 2;
        dy = (displayHeight - dh) / 2;
      } else if (objectFit === "contain") {
        const scale = Math.min(displayWidth / img.naturalWidth, displayHeight / img.naturalHeight);
        dw = img.naturalWidth * scale;
        dh = img.naturalHeight * scale;
        dx = (displayWidth - dw) / 2;
        dy = (displayHeight - dh) / 2;
      }
      offCtx.drawImage(img, dx, dy, dw, dh);

      const data = offCtx.getImageData(0, 0, off.width, off.height).data;
      const stride = off.width * 4;
      const dotSize = Math.max(1, Math.floor(cellSize * dotScale));
      dimsRef.current = { width: displayWidth, height: displayHeight, dot: dotSize };

      const samples = [];
      for (let y = 0; y < off.height; y += cellSize) {
        for (let x = 0; x < off.width; x += cellSize) {
          const cx = Math.min(off.width - 1, x + Math.floor(cellSize / 2));
          const cy = Math.min(off.height - 1, y + Math.floor(cellSize / 2));
          const idx = cy * stride + cx * 4;
          let r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3] / 255;

          if (grayscale) {
            const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            r = g = b = L;
          } else if (tintColor && tintStrength > 0) {
            const hex = tintColor.replace("#", "");
            const tr = parseInt(hex.substring(0, 2), 16);
            const tg = parseInt(hex.substring(2, 4), 16);
            const tb = parseInt(hex.substring(4, 6), 16);
            const k = Math.min(1, Math.max(0, tintStrength));
            r = Math.round(r * (1 - k) + tr * k);
            g = Math.round(g * (1 - k) + tg * k);
            b = Math.round(b * (1 - k) + tb * k);
          }

          samples.push({ x, y, r, g, b, a });
        }
      }
      samplesRef.current = samples;
    };

    const draw = () => {
      const now = performance.now();
      const minDelta = 1000 / maxFps;
      if (now - lastFrame.current < minDelta) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      lastFrame.current = now;

      const ctx = canvas.getContext("2d");
      const dims = dimsRef.current;
      const samples = samplesRef.current;
      if (!ctx || !dims || !samples) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      animMouse.current.x += (targetMouse.current.x - animMouse.current.x) * followSpeed;
      animMouse.current.y += (targetMouse.current.y - animMouse.current.y) * followSpeed;
      activity.current += (activityTarget.current - activity.current) * 0.1;

      if (backgroundColor) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, dims.width, dims.height);
      } else {
        ctx.clearRect(0, 0, dims.width, dims.height);
      }

      const mx = animMouse.current.x;
      const my = animMouse.current.y;
      const sigma = Math.max(1, distortionRadius * 0.5);

      for (const s of samples) {
        let drawX = s.x + cellSize / 2;
        let drawY = s.y + cellSize / 2;

        if (interactive) {
          const dx = drawX - mx, dy = drawY - my;
          const dist2 = dx * dx + dy * dy;
          const falloff = Math.exp(-dist2 / (2 * sigma * sigma));
          const influence = falloff * activity.current;
          if (influence > 0.001) {
            if (distortionMode === "repel") {
              const dist = Math.sqrt(dist2) + 0.0001;
              drawX += (dx / dist) * distortionStrength * influence;
              drawY += (dy / dist) * distortionStrength * influence;
            } else if (distortionMode === "attract") {
              const dist = Math.sqrt(dist2) + 0.0001;
              drawX -= (dx / dist) * distortionStrength * influence;
              drawY -= (dy / dist) * distortionStrength * influence;
            } else if (distortionMode === "swirl") {
              const angle = distortionStrength * 0.05 * influence;
              const cosA = Math.cos(angle), sinA = Math.sin(angle);
              const rx = cosA * dx - sinA * dy;
              const ry = sinA * dx + cosA * dy;
              drawX = mx + rx; drawY = my + ry;
            }
            const t = performance.now() * 0.001 * jitterSpeed;
            drawX += Math.sin(s.x + t) * jitterStrength * influence;
            drawY += Math.cos(s.y + t) * jitterStrength * influence;
          }
        }

        ctx.globalAlpha = s.a;
        ctx.fillStyle = `rgb(${s.r}, ${s.g}, ${s.b})`;
        if (shape === "circle") {
          ctx.beginPath();
          ctx.arc(drawX, drawY, dims.dot / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(drawX - dims.dot / 2, drawY - dims.dot / 2, dims.dot, dims.dot);
        }
      }
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    // Pointer events
    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      targetMouse.current.x = e.clientX - rect.left;
      targetMouse.current.y = e.clientY - rect.top;
      pointerInside.current = true;
      activityTarget.current = 1;
    };
    const onPointerLeave = () => {
      pointerInside.current = false;
      if (fadeOnLeave) activityTarget.current = 0;
    };
    if (interactive) {
      canvas.addEventListener("pointermove", onPointerMove);
      canvas.addEventListener("pointerleave", onPointerLeave);
    }

    // Responsive
    const onResize = () => {
      if (img.complete && img.naturalWidth) computeSamples();
    };
    if (responsive) window.addEventListener("resize", onResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      img.onload = null;
      img.onerror = null;
      if (interactive) {
        canvas.removeEventListener("pointermove", onPointerMove);
        canvas.removeEventListener("pointerleave", onPointerLeave);
      }
      if (responsive) window.removeEventListener("resize", onResize);
    };
  }, [src, width, height]);

  return <canvas style={{borderRadius:"50%"}} ref={canvasRef} className={className} role="img" />;
};
