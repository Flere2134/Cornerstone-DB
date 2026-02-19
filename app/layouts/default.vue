<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

// Tracks whether the mobile menu is open or closed
const isMobileMenuOpen = ref(false)
const route = useRoute()

// Automatically close the mobile menu whenever the user clicks a link and changes pages
watch(() => route.path, () => {
  isMobileMenuOpen.value = false
})
</script>

<template>
  <div class="flex h-screen w-full bg-slate-900 text-slate-200 font-sans overflow-hidden">
    
    <div class="md:hidden absolute top-0 left-0 w-full flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800 z-30 shadow-md">
      <div class="flex items-center gap-2">
        <img src="/ipc-logo.png" alt="IPC Logo" class="w-8 h-8 object-contain drop-shadow-md" />
        <h1 class="text-lg font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 mt-1">
          Cornerstone DB
        </h1>
      </div>
      <button @click="isMobileMenuOpen = true" class="p-2 text-slate-400 hover:text-amber-400 focus:outline-none transition-colors" aria-label="Open Menu">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </button>
    </div>

    <div 
      v-if="isMobileMenuOpen" 
      @click="isMobileMenuOpen = false" 
      class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
    ></div>

    <aside 
      :class="[
        'fixed inset-y-0 left-0 w-64 bg-slate-950 border-r border-slate-800 flex flex-col z-50 shadow-2xl transition-transform duration-300 ease-in-out md:relative md:translate-x-0',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="p-6 flex items-center justify-between gap-3 border-b border-slate-800/50">
        <NuxtLink to="/" class="flex items-center gap-3">
          <img src="/ipc-logo.png" alt="IPC Logo" class="w-10 h-10 object-contain drop-shadow-md" />
          <h1 class="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 mt-1">
            Cornerstone DB
          </h1>
        </NuxtLink>
        <button @click="isMobileMenuOpen = false" class="md:hidden p-1 text-slate-400 hover:text-amber-400 transition-colors" aria-label="Close Menu">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        
        <NuxtLink 
          to="/" 
          class="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-transparent font-medium"
          active-class="!bg-amber-500/10 !text-amber-400 border-amber-500/20 shadow-sm"
        >
          <img src="https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/sign/AvatarIcon.png" class="w-6 h-6 object-contain opacity-70 group-hover:opacity-100 transition-opacity drop-shadow-sm" alt="Characters" />
          Characters
        </NuxtLink>

        <NuxtLink 
          to="/lightcones" 
          class="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-transparent font-medium"
          active-class="!bg-amber-500/10 !text-amber-400 border-amber-500/20 shadow-sm"
        >
          <img src="/LightConeIcon.png" class="w-6 h-6 object-contain opacity-70 group-hover:opacity-100 transition-opacity drop-shadow-sm" alt="Lightcones" />
          Lightcones
        </NuxtLink>

        <NuxtLink 
          to="/relics" 
          class="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-transparent font-medium"
          active-class="!bg-amber-500/10 !text-amber-400 border-amber-500/20 shadow-sm"
        >
          <img src="/RelicIcon.png" class="w-6 h-6 object-contain opacity-70 group-hover:opacity-100 transition-opacity drop-shadow-sm" alt="Relic Sets" />
          Relic Sets
        </NuxtLink>
      </nav>
    </aside>

    <main class="flex-1 overflow-y-auto bg-slate-900 relative pt-16 md:pt-0 flex flex-col">
      
      <div class="flex-1">
        <slot />
      </div>

      <footer class="bg-slate-950 py-8 border-t border-slate-800/50 z-10 relative mt-auto">
        <div class="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8">
          
          <div class="text-center lg:text-left text-sm text-slate-500">
            <p class="mb-2 leading-relaxed">
              Cornerstone DB is a fan-made database website and is not affiliated with, endorsed, sponsored, or approved by Hoyoverse.
            </p>
            <p class="leading-relaxed mb-4">
              All game data, images, and assets are copyrights and trademarks of Hoyoverse.
            </p>

            <div class="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 text-slate-400 text-xs"> 
               <a href="https://github.com/Mar-7th/StarRailRes" target="_blank" class="hover:text-amber-400 transition-colors">Data Source</a>
            </div>
          </div>

          <div class="flex items-center gap-8 lg:gap-10 text-slate-400">
            
            <div class="flex flex-col items-center lg:items-start gap-3">
              <span class="text-[0.65rem] font-bold uppercase tracking-widest text-slate-500">Developer SNS</span>
              <div class="flex items-center gap-4">
                <a href="https://x.com/Icchan_10032" target="_blank" class="hover:text-amber-400 transition-colors" aria-label="Twitter">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.004 3.83H5.078z"/></svg>
                </a>
                <a href="https://discord.com/users/742617029575704627" target="_blank" class="hover:text-amber-400 transition-colors" aria-label="Discord">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>
                </a>
              </div>
            </div>

            <div class="w-px h-10 bg-slate-800 hidden md:block"></div>

            <div class="flex flex-col items-center lg:items-start gap-3">
              <span class="text-[0.65rem] font-bold uppercase tracking-widest text-slate-500">Made With</span>
              <div class="flex items-center gap-4">
                <a href="https://vuejs.org/" target="_blank" class="hover:text-[#41B883] transition-colors" aria-label="Vue.js">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M24,2.06A.59.59,0,0,0,23.5,1.8H18.91a.63.63,0,0,0-.54.3L12,13.29,5.63,2.1a.63.63,0,0,0-.54-.3H.5A.59.59,0,0,0,0,2.06a.6.6,0,0,0,.1.39L11.45,21.78a.64.64,0,0,0,1.09,0L23.9,2.45A.6.6,0,0,0,24,2.06Z"/></svg>
                </a>
                <a href="https://tailwindcss.com/" target="_blank" class="hover:text-[#38BDF8] transition-colors" aria-label="Tailwind CSS">
                  <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 6.036c-2.667 0-4.333 1.325-5 3.976 1-1.325 2.167-1.822 3.5-1.491.761.189 1.305.738 1.906 1.345C13.387 10.855 14.522 12 18 12c2.667 0 4.333-1.325 5-3.976-1 1.325-2.167 1.822-3.5 1.491-.761-.189-1.305-.738-1.906-1.345-.981-.989-2.116-2.134-5.594-2.134zm-6 5.964c-2.667 0-4.333 1.325-5 3.976 1-1.325 2.167-1.822 3.5-1.491.761.189 1.305.738 1.906 1.345C7.387 16.819 8.522 17.964 12 17.964c2.667 0 4.333-1.325 5-3.976-1 1.325-2.167 1.822-3.5 1.491-.761-.189-1.305-.738-1.906-1.345-.981-.989-2.116-2.134-5.594-2.134z"/></svg>
                </a>
              </div>
            </div>

          </div>
        </div>
      </footer>

    </main>

  </div>
</template>