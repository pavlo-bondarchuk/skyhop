import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { include: ['src/**/*.test.ts'] }, build: { rollupOptions: { output: { manualChunks: (id: string) => id.includes('/node_modules/three/') ? 'three' : undefined } } } });
