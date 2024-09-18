import * as pjson from './package.json'


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  extends: ['@nuxt/ui-pro'],
  modules: [
    '@tresjs/nuxt',
    '@nuxt/ui',
    '@nuxt/content',
    '@vueuse/nuxt',
    '@nuxtjs/supabase'
  ],
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
      include: undefined,
      exclude: ['index', '/confirm', '/signup', '/forgot-password', '/reset-password', '/preview/*', '/api/*'],
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
  }
})