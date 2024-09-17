import { defineConfig } from "vite";
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import { templateCompilerOptions } from "@tresjs/core";



export default defineConfig({
    root: resolve(__dirname, "src"),
    plugins: [vue({
        ...templateCompilerOptions,
        features: {
          customElement: /\.ce\.vue$/
        }
    })],
    
    build: {
        outDir: resolve(__dirname, "dist"),
        emptyOutDir: true,
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'Easy360Embedded',
            // the proper extensions will be added
            fileName: 'easy-360-embedded',
          },
    },
    define: {
      'process.env.NODE_ENV': '"production"'
    }
})