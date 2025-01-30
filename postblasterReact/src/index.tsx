import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

import Blaster from "./Blaster"; // Add this line

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Blaster /> {/* Update this line */}
  </StrictMode>
);