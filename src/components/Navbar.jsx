import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";


export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // handle window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>MyLogo</div>

      {isMobile ? (
        <>
          <button
            style={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          {menuOpen && (
            <div style={styles.mobileMenu}>
              {navItems.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  style={styles.mobileMenuItem}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          )}
        </>
      ) : (
        <div style={styles.menu}>
          {navItems.map((item, idx) => (
            <a key={idx} href={item.href} style={styles.menuItem}>
              {item.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem 1rem",
    backgroundColor: "#1e1e1e",
    color: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  logo: {
    fontWeight: "bold",
    fontSize: "1.2rem",
  },
  menu: {
    display: "flex",
    gap: "1rem",
  },
  menuItem: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "500",
  },
  hamburger: {
    fontSize: "1.5rem",
    background: "none",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },
  mobileMenu: {
    position: "absolute",
    top: "60px",
    right: 0,
    backgroundColor: "#1e1e1e",
    width: "200px",
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
    borderRadius: "5px",
  },
  mobileMenuItem: {
    color: "#fff",
    textDecoration: "none",
    padding: "0.5rem 0",
  },
}
