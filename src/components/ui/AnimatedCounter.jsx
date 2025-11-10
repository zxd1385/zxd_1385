import React, { useState, useEffect } from "react";

function AnimatedCounter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16); // roughly 60fps

    const handle = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(handle);
      }
      setCount(Math.floor(start));
    }, 16);

    return () => clearInterval(handle);
  }, [target, duration]);

  return <span>{count}</span>;
}

export default AnimatedCounter;
