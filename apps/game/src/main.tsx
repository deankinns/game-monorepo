import React from "react";
import { createRoot } from "react-dom/client";

import "ui/w3.css";
import "./index.css";

import App from "./App";


createRoot(document.getElementById("root") as HTMLElement).render(<React.StrictMode><App /></React.StrictMode>);
