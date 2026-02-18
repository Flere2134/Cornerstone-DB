<template>
  <div class="flex h-screen w-full bg-slate-900 text-slate-200 font-sans overflow-hidden">
    
    <aside class="w-64 flex-shrink-0 bg-slate-950 border-r border-slate-800 flex flex-col z-20 shadow-2xl">
      
      <div class="p-6 flex items-center gap-3 border-b border-slate-800/50">
        <img src="/ipc-logo.png" alt="IPC Logo" class="w-10 h-10 object-contain drop-shadow-md" />
        <h1 class="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 mt-1">
          Cornerstone DB
        </h1>
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
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
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

    <main class="flex-1 overflow-y-auto bg-slate-900 relative">
      <slot /> </main>

  </div>
</template>