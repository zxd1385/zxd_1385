import { useState, useEffect } from "react";

export const breakpoints = [
  { query: "(max-width: 480px)", size: { width: 250, height: 250 } },
  { query: "(max-width: 768px)", size: { width: 350, height: 350 } },
  { query: "(max-width: 1024px)", size: { width: 450, height: 450 } },
  { query: "(min-width: 1025px)", size: { width: 500, height: 500 } },
];

export function useResponsiveSizes() {
  const [size, setSize] = useState({ width: 500, height: 500 });

  useEffect(() => {
    const mqls = breakpoints.map((bp) => ({
      mql: window.matchMedia(bp.query),
      size: bp.size,
    }));

    const updateSize = () => {
      for (let i = 0; i < mqls.length; i++) {
        if (mqls[i].mql.matches) {
          setSize(mqls[i].size);
          return;
        }
      }
    };

    updateSize();

    mqls.forEach(({ mql }) => mql.addEventListener("change", updateSize));
    return () => {
      mqls.forEach(({ mql }) => mql.removeEventListener("change", updateSize));
    };
  }, []);

  return size;
}
