import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],   // ✅ make sure only one copy is bundled
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
});
