import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes, FaPlusCircle, FaProjectDiagram, FaEnvelope, FaPencilAlt} from "react-icons/fa";
import { Icon } from "@chakra-ui/react";


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
                <Icon as={item.icon} style={styles.icon} /> {item.title}
              </a>
            ))}
          </div>
        )}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={styles.mobileToggle}
        >
          {mobileOpen ? <FaTimes size={24}  /> : <FaPencilAlt size={18} />}
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
          <div style={styles.icon}><Icon as={item.icon} style={styles.icon} /></div>
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
    bottom: "16px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "8px",
    padding: "4px 12px",
    background: "#121212",        // dark minimal background
    borderRadius: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    zIndex: 1000,
  },
  desktopItem: {
    position: "relative",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#1f1f1f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  desktopItemHover: {
    background: "#2a2a2a",
  },
  icon: {
    fontSize: "18px",
    color: "#e0e0e0",
  },
  tooltip: {
    position: "absolute",
    bottom: "50px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "2px 6px",
    background: "#2a2a2a",
    color: "#fff",
    fontSize: "11px",
    borderRadius: "4px",
    whiteSpace: "nowrap",
    opacity: 0.9,
  },
  mobileContainer: {
    position: "fixed",
    bottom: "16px",
    right: "16px",
    zIndex: 1000,
    display: "flex",
    alignItems: "end",
    gap: "5px"
  },
  mobileToggle: {
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    background: "#1f1f1f",
    color: "#e0e0e0",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.2s ease",
  },
  mobileToggleHover: {
    background: "#2a2a2a",
  },
  mobileMenu: {
    marginBottom: "6px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    background: "#121212",
    borderRadius: "10px",
    padding: "6px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  },
  mobileItem: {
    padding: "6px 8px",
    textDecoration: "none",
    color: "#e0e0e0",
    fontWeight: "500",
    borderRadius: "4px",
    transition: "background 0.2s ease",
  },
  mobileItemHover: {
    background: "#1f1f1f",
  },
};

