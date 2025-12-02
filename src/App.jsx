import { Routes, Route } from "react-router-dom";
import { FaPlusCircle, FaProjectDiagram, FaEnvelope } from "react-icons/fa";
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
import StatusBar from "./components/ui/StatusBar";
import FloatingLines from "./components/ui/FloatingLines";


function App() {
  
  return (
    <>
      
      {/* <AnimatedGradientBackground   /> */}
      
  <div style={{ width: "100%",
    height: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: -1 }}>
    <FloatingLines 
    enabledWaves={['top', 'middle', 'bottom']}
    // Array - specify line count per wave; Number - same count for all waves
    lineCount={[5, 5, 6]}
    // Array - specify line distance per wave; Number - same distance for all waves
    lineDistance={[8, 6, 4]}
    bendRadius={5.0}
    bendStrength={-0.5}
    interactive={true}
    parallax={true}
  />


  
</div>



    


    <Navbar  />
    <FloatingDock
        items={[
          { title: "Create Article", href: "/#creat-article", icon: FaPlusCircle },
          { title: "Create Project", href: "/#creat-project", icon: FaProjectDiagram },
          { title: "Contact", href: "/#contact", icon: FaEnvelope }, // only for logged-in users
        ]}
      />

        <StatusBar />

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
