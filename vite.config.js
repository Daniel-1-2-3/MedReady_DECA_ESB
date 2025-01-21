import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: "/MedReady_DECA_ESB/", // Replace with your repository name
  plugins: [react()],
});
