import glsl from 'vite-plugin-glsl';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  root: "src/",
  publicDir: "assets",
  build: {
    outDir: "../dist"
  },
  plugins: [glsl()]
});