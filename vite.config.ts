import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
      name: "AIWebComponent",
      formats: ["es"],
      fileName: "index"
    },
    rollupOptions: {
      external: ["react", "react-dom"]
    }
  }
});
