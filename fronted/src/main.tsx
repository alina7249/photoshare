// main.tsx - React应用入口文件
// 注意：根据平台限制，我们只能提供React+TypeScript解决方案
// 如果要转换为Vue，此文件需要完全重写为Vue的入口文件

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'sonner';
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </StrictMode>
);
