// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
  ],

  image: {
    domains: ['raw.githubusercontent.com']
  },
  app: {
    head: {
      title: 'Cornerstone DB', // This changes the text in the browser tab!
      link: [
        // This links your existing IPC logo as the favicon
        { rel: 'icon', type: 'image/png', href: '/ipc-logo.png' } 
      ]
    }
  }
})
