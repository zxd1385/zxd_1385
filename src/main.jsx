import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { HashRouter } from "react-router-dom"; // Import HashRouter instead of BrowserRouter
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider value={defaultSystem}>
      <HashRouter> {/* Use HashRouter here */}
        <App />
      </HashRouter>
    </ChakraProvider>
  </React.StrictMode>
);
