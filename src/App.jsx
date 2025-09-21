import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AnimatedGradientBackground from "./components/ui/GlobalVortexBackground"
import FloatingDock from "./components/FloatingDock";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import ArticlePage from "./pages/ArticlePage";

function App() {
  
  return (
    <>
      
      <AnimatedGradientBackground   />
      <Navbar  />
      <FloatingDock
           items={[
             { title: "Home", href: "/", icon: "🏠" },
             { title: "Projects", href: "/projects", icon: "💻" },
             { title: "Contact", href: "/contact", icon: "✉️" },
           ]}
       />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/article/:folderName" element={<ArticlePage />} />
      </Routes>
      <Footer />
      
    </>
  );
}

export default App;
