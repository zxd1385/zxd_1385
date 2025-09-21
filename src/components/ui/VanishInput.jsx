import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";

export default function VanishInput({ placeholders = [], onChange, onSubmit }) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [value, setValue] = useState("");
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef(null);
  const canvasRef = useRef(null);
  const inputRef = useRef(null);
  const newDataRef = useRef([]);
  
  // Rotate placeholders every 3s
  useEffect(() => {
    const startAnimation = () => {
      intervalRef.current = setInterval(() => {
        setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
      }, 3000);
    };
    startAnimation();
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState !== "visible") clearInterval(intervalRef.current);
      else startAnimation();
    });
    return () => clearInterval(intervalRef.current);
  }, [placeholders]);

  // Draw text as pixels inside input
  const draw = useCallback(() => {
    if (!inputRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);
    ctx.font = "16px sans-serif"; // match input text size
    ctx.fillStyle = "#FFF"; // text color
    ctx.fillText(value, 10, height / 2 + 5);

    const data = ctx.getImageData(0, 0, width, height).data;
    const pixels = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        if (data[i + 3] > 0) pixels.push({ x, y, r: 1, color: `rgba(${data[i]},${data[i+1]},${data[i+2]},${data[i+3]})` });
      }
    }
    newDataRef.current = pixels;
  }, [value]);

  useEffect(() => {
    draw();
  }, [value, draw]);

  // Animate vanish particles
  const animateVanish = (startX) => {
    const frame = (pos) => {
      requestAnimationFrame(() => {
        const next = [];
        newDataRef.current.forEach((p) => {
          if (p.x < pos) next.push(p);
          else {
            p.x += Math.random() > 0.5 ? 1 : -1;
            p.y += Math.random() > 0.5 ? 1 : -1;
            p.r -= 0.05;
            if (p.r > 0) next.push(p);
          }
        });
        newDataRef.current = next;

        const ctx = canvasRef.current?.getContext("2d");
        const { width, height } = canvasRef.current;
        if (ctx) {
          ctx.clearRect(0, 0, width, height);
          newDataRef.current.forEach(({ x, y, r, color }) => {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, r, r);
          });
        }

        if (next.length > 0) frame(pos - 6);
        else {
          setValue("");
          setAnimating(false);
        }
      });
    };
    frame(startX);
  };

  const vanishAndSubmit = () => {
    if (!value) return;
    setAnimating(true);
    draw();
    const maxX = Math.max(...newDataRef.current.map((p) => p.x), 0);
    animateVanish(maxX);
    onSubmit?.(value);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        vanishAndSubmit();
      }}
      className="relative w-full max-w-md mx-auto h-12 rounded-full bg-white shadow overflow-hidden"
    >
      {/* Canvas on top of input */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 pointer-events-none transition-opacity ${animating ? "opacity-100" : "opacity-0"}`}
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          if (!animating) {
            setValue(e.target.value);
            onChange?.(e.target.value);
          }
        }}
        onKeyDown={(e) => e.key === "Enter" && vanishAndSubmit()}
        placeholder={placeholders[currentPlaceholder]}
        className={`w-full h-full pl-4 pr-12 bg-transparent outline-none text-sm ${animating && "text-transparent"}`}
      />
      <button
        disabled={!value}
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black text-white flex items-center justify-center disabled:bg-gray-200"
      >
        ➤
      </button>
      <div className="absolute inset-0 flex items-center rounded-full pointer-events-none">
        <AnimatePresence mode="wait">
          {!value && (
            <motion.p
              initial={{ y: 5, opacity: 0 }}
              key={`current-placeholder-${currentPlaceholder}`}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.3, ease: "linear" }}
              className="dark:text-zinc-500 text-sm sm:text-base font-normal text-neutral-500 pl-4 sm:pl-12 text-left w-[calc(100%-2rem)] truncate"
            >
              {placeholders[currentPlaceholder]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
