import { useState, useEffect } from "react"


export default function StudyngProgressBar() {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
      const updateScrollProgress = () => {
        // const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const scrollTop = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        const totalScrollable = scrollHeight - clientHeight;
        const progress = (scrollTop / totalScrollable) * 100;
        setScrollProgress(progress);
        // console.log(scrollProgress);
        // console.log(scrollTop);
        // console.log(scrollHeight);
        // console.log(clientHeight);
      };
  
        window.addEventListener("scroll", updateScrollProgress);
        window.addEventListener("resize", updateScrollProgress);

    // Run once initially
      // Run once on mount
      updateScrollProgress();
  
      
    }, []);

    // useEffect(() => {
    //     console.log("Updated scroll progress:", scrollProgress);
    //   }, [scrollProgress]);
      

      return (
        <div
  style={{
    position: "fixed",
    bottom: "50px",
    right: "3px",
    zIndex: 1000,
    width: "60px",
    height: "60px",
  }}
>
  {/* SVG Circle */}
  <svg width="60" height="60">
    <circle
      cx="30"
      cy="30"
      r="15"
      fill="none"
      stroke="teal"
      strokeWidth="3"
      strokeDasharray={100}
      strokeDashoffset={100 - scrollProgress}
      strokeLinecap="round"
    />
  </svg>

  {/* Percentage Text */}
  <div
    style={{
      position: "absolute",   // overlay on top of the SVG
      top: "50%",             // center vertically
      left: "50%",            // center horizontally
      transform: "translate(-50%, -50%)", // true center
      color: "white",
      fontSize: "10px",
      fontWeight: "bold",
      pointerEvents: "none",  // so it doesn’t block mouse events
    }}
  >
    {Math.round(scrollProgress)}%
  </div>
        </div>

      );
      
}