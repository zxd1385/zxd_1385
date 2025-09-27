import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AnimatedGradientBackground from "./components/ui/GlobalVortexBackground"
import FloatingDock from "./components/FloatingDock";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import About from "./pages/About";
import ContactForm from "./pages/ContactForm";
import Dashboard from "./pages/Dashboard";
import CreateArticle from "./pages/CreateArticle";
import ArticlePage from "./pages/ArticlePage";
import ArticlesPage from "./pages/ArticlesPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectPage from "./pages/ProjectPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import ProtectedRoute from "./components/serverComponents/ProtectedRoute";


function App() {
  
  return (
    <>
      
      <AnimatedGradientBackground   />
      <Navbar  />
      <FloatingDock
        items={[
          { title: "Home", href: "/#", icon: "🏠" },
          { title: "Projects", href: "/#projects", icon: "💻" },
          { title: "Articles", href: "/#articles", icon: "📝" },
          { title: "Contact", href: "/#contact", icon: "✉️" },       // only for logged-in users
        ]}
      />


      <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<ContactForm />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/article/:id" element={<ArticlePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/project/:id" element={<ProjectPage />} />
              
              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/creat-article"
                element={
                  <ProtectedRoute>
                    <CreateArticle />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-article/:id"
                element={
                  <ProtectedRoute>
                    <CreateArticle />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/creat-project"
                element={
                  <ProtectedRoute>
                    <CreateProjectPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-project/:id"
                element={
                  <ProtectedRoute>
                    <CreateProjectPage />
                  </ProtectedRoute>
                }
              />
      </Routes>
      <Footer />
      
    </>
  );
}

export default App;
