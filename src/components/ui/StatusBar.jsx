import React from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "./Breadcrumbs";

const StatusBar = () => {
    const location = useLocation();

    // Get path segments from location.pathname (e.g. "/articles/article_1" -> ["articles", "article_1"])
const rawSegments = location.pathname.split("/").filter(Boolean);

// Example: map known paths to nicer labels, or remove certain segments
const pathSegments = rawSegments.map((segment, idx) => {
    let label = "";
    let href = "#" + "/" + rawSegments.slice(0, idx + 1).join("/");
  
    switch(segment) {
      case "creat-article":
        label = "Create Article";
        break;
      case "creat-project":
        label = "Create Project";
        break;
      case "dashboard":
        label = "Dashboard";
        break;
      case "projects":
        label = "Projects";
        break;
      case "articles":
        label = "Articles";
        break;
      case "article":
        label = "Articles";
        href = "#/articles"
        break;
      case "project":
        label = "Projects";
        href = "#/projects"
        break;
      case "contact":
        label = "Contact Us";
        break;
      case "about":
        label = "About";
        break;
      case "login":
        label = "Login";
        break;
      // add your custom mappings here
      default:
        label = segment.replace(/-/g, " ").slice(0,10) + "...";
    }
  
    return { label, href };
  });
  
    return <Breadcrumbs pathSegments={pathSegments} />;
};

export default StatusBar;