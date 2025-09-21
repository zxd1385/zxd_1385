import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";


export default function FloatingDock({ items }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Simple function to compute scale based on distance
  const getScale = (index) => {
    if (hoveredIndex === null) return 1;
    const distance = Math.abs(hoveredIndex - index);
    return distance === 0 ? 1.8 : distance === 1 ? 1.3 : 1;
  };

  if (isMobile) {
    return (
      <div style={styles.mobileContainer}>
        {mobileOpen && (
          <div style={styles.mobileMenu}>
            {items.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                style={{ ...styles.mobileItem }}
                onClick={() => setMobileOpen(false)}
              >
                {item.icon} {item.title}
              </a>
            ))}
          </div>
        )}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={styles.mobileToggle}
        >
          {mobileOpen ? <FaTimes size={24}  /> : <FaBars size={24} />}
        </button>
      </div>
    );
  }

  return (
    <div style={styles.desktopContainer}>
      {items.map((item, idx) => (
        <a
          key={idx}
          href={item.href}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{
            ...styles.desktopItem,
            transform: `scale(${getScale(idx)})`,
            transition: "transform 0.2s",
          }}
        >
          <div style={styles.icon}>{item.icon}</div>
          {hoveredIndex === idx && (
            <div style={styles.tooltip}>{item.title}</div>
          )}
        </a>
      ))}
    </div>
  );
}

// Basic inline styles
const styles = {
  desktopContainer: {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "12px",
    padding: "8px 16px",
    background: "#f0f0f0",
    borderRadius: "32px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: 1000,
  },
  desktopItem: {
    position: "relative",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  icon: {
    fontSize: "24px",
  },
  tooltip: {
    position: "absolute",
    bottom: "60px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "4px 8px",
    background: "#333",
    color: "#fff",
    fontSize: "12px",
    borderRadius: "4px",
    whiteSpace: "nowrap",
  },
  mobileContainer: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 1000,
  },
  mobileToggle: {
    width: "40px",       // fixed width
    height: "40px",      // fixed height
    display: "flex",     // flex to center content
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    background: "#1e1e1e",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
  },
  mobileMenu: {
    marginBottom: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    background: "#fff",
    borderRadius: "12px",
    padding: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  mobileItem: {
    padding: "8px",
    textDecoration: "none",
    color: "#333",
    fontWeight: "500",
  },
};
