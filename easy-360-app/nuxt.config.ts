import * as pjson from './package.json'
import glsl from 'vite-plugin-glsl';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  extends: ['@nuxt/ui-pro'],
  modules: ['@tresjs/nuxt', '@nuxt/ui', '@vueuse/nuxt', '@nuxtjs/supabase', '@nuxt/content', '@nuxt/image'],
  icon: {
    serverBundle: {
      collections: ['heroicons'] // <!--- this
    }
  },
  runtimeConfig: {
    public: {
      supabaseStorageEndpoint: process.env.SUPABASE_STORAGE_URL || '',
      app_version: pjson.version
    }
  },
  supabase: {
    redirect: true,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      include: ['/app(/*)?', '/editor(/*)?'],
      exclude: ['/', '/docs(/*)?', '/blog(/*)?', '/confirm', '/signup', '/forgot-password', '/reset-password', '/preview/*', '/api(/*)?'],
      cookieRedirect: true,
    },
    cookieOptions: {
      maxAge: 60 * 60 * 8,
      sameSite: 'lax',
      secure: true
    }
  },
  routeRules: {
    '/': { prerender: true },
    '/app/**': { ssr: false },
    '/editor/**': { ssr: false },
    '/api/**': { cors: true },
    '/docs': { redirect: '/docs/getting-started', prerender: false }
  },
  vite: {
    plugins: [glsl()],
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler"
        }
      }
    }
  }
})