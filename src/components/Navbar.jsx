import React, { useState, useEffect } from "react";
import { Icon, Input, Box, Text, Spinner} from "@chakra-ui/react";
import { FaBars, FaTimes, FaHome, FaInfoCircle, FaProjectDiagram, FaNewspaper, FaEnvelope, FaSearch } from "react-icons/fa";
import AuthButton from "./serverComponents/AuthButton";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./ui/Loading";


export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");  // State to hold the search query
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false) 

  const navigate = useNavigate()

  // handle window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { name: "Home", href: "#/", icon: FaHome },
    { name: "About", href: "#/about", icon: FaInfoCircle },
    { name: "Projects", href: "#/projects", icon: FaProjectDiagram },
    { name: "Articles", href: "#/articles", icon: FaNewspaper },
    { name: "Contact", href: "#/contact", icon: FaEnvelope }, // show if logged in
  ];

  const handleBlur = () => {
    // Clear search results after losing focus
    setTimeout(() => {
      setSearchQuery("");
      setSearchResults([]);
    }, 150); // small timeout to allow click on a result
  };

  
  // Handle Search Query Change
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setIsSearching(true)
    setSearchQuery(query);
    console.log(query);

    if (query.length > 2) {
      // Search articles
      const { data: articlesData } = await supabase
        .from("articles")
        .select("id, title")
        .eq('is_visible', true)
        .ilike("title", `%${query}%`)
        .limit(5);
  
      // Search projects
      const { data: projectsData } = await supabase
        .from("projects")
        .select("id, title, description")
        .eq('is_visible', true)
        .ilike("title", `%${query}%`)
        .limit(5);
  
      // Combine results
      const combinedResults = [
        ...(articlesData || []).map(item => ({ ...item, type: "article" })),
        ...(projectsData || []).map(item => ({ ...item, type: "project" }))
      ];
  
      setSearchResults(combinedResults);
    } else {
      setSearchResults([]);
    }

    setIsSearching(false)
  };
  

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <span style={{ marginRight: "10px" }}>zxdClub</span>
      </div>

      {/* Search Bar */}
      <Box position="relative" display="flex" alignItems="center">
        <Input
          placeholder="Search Articles/Projects..."
          value={searchQuery}
          onChange={handleSearchChange}
          onBlur={handleBlur}
          size="sm"
          width="200px"
          color="#fff"
          _focus={{ borderColor: "teal.300" }}
          variant="outline"
        />
        {isSearching ? <Spinner position="absolute" right="8px" color="gray.400" />
        : <Icon as={FaSearch} position="absolute" right="8px" color="gray.400" />}
        
        {/* Display Search Results */}
        { searchResults.length > 0 ? (
            <Box position="absolute" top="100%" left="0" width="100%" backgroundColor="gray.800" boxShadow="lg" borderRadius="5px">
    {searchResults.map((result) => (
      <Box
        key={`${result.type}-${result.id}`}
        padding="4px"
        color="white"
        cursor="pointer"
        _hover={{ backgroundColor: "gray.700" }}
        onClick={() => navigate(`/${result.type}/${result.id}`)} // navigate to correct page
      >
        <strong>{result.title}</strong>
        <Text fontSize="xs" color="gray.400">{result.type.toUpperCase()}</Text>
      </Box>
    ))}
            </Box>
            ) : searchQuery && (
              <Box position="absolute" top="100%" left="0" width="100%" backgroundColor="gray.800" boxShadow="lg" borderRadius="5px">
                <Box
        key={"nothing foun"}
        padding="4px"
        color="white"
        cursor="pointer"
        _hover={{ backgroundColor: "gray.700" }}
      >
        Noyhing found for "{searchQuery}"
      </Box>
            </Box>
            )}
      </Box>
      

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
                  <Icon as={item.icon} mr={2} /> 
                  {item.name}
                </a>
              ))}
              
        <AuthButton />
            </div>
          )}
        </>
      ) : (
        <div style={styles.menu}>
          {navItems.map((item, idx) => (
            <a key={idx} href={item.href} style={styles.menuItem}>
              <Icon as={item.icon} mr={2} /> 
              {item.name}
            </a>
          ))}
          <AuthButton />
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
    fontSize: "1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  menu: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
    right: "10px",
    backgroundColor: "#1e1e1e",
    width: "240px",
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
