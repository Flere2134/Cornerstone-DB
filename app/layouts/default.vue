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
      <button @click="isMobileMenuOpen = true" class="p-2 text-slate-400 hover:text-amber-400 focus:outline-none transition-colors">
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
        <div class="flex items-center gap-3">
          <img src="/ipc-logo.png" alt="IPC Logo" class="w-10 h-10 object-contain drop-shadow-md" />
          <h1 class="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 mt-1">
            Cornerstone DB
          </h1>
        </div>
        <button @click="isMobileMenuOpen = false" class="md:hidden p-1 text-slate-400 hover:text-amber-400 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        
        <NuxtLink 
          to="/" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-transparent font-medium"
          active-class="!bg-amber-500/10 !text-amber-400 border-amber-500/20 shadow-sm"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          Characters
        </NuxtLink>

        <NuxtLink 
          to="/lightcones" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-transparent font-medium"
          active-class="!bg-amber-500/10 !text-amber-400 border-amber-500/20 shadow-sm"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
          Lightcones
        </NuxtLink>

        <NuxtLink 
          to="/relics" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-transparent font-medium"
          active-class="!bg-amber-500/10 !text-amber-400 border-amber-500/20 shadow-sm"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
          Relic Sets
        </NuxtLink>

      </nav>
      
    </aside>

    <main class="flex-1 overflow-y-auto bg-slate-900 relative pt-16 md:pt-0">
      <slot /> 
    </main>

  </div>
</template>