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
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
          Characters
        </NuxtLink>

        <NuxtLink 
          to="/lightcones" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-transparent font-medium"
          active-class="!bg-amber-500/10 !text-amber-400 border-amber-500/20 shadow-sm"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
          Lightcones
        </NuxtLink>

        <NuxtLink 
          to="/relics" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-transparent font-medium"
          active-class="!bg-amber-500/10 !text-amber-400 border-amber-500/20 shadow-sm"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
          Relic Sets
        </NuxtLink>

      </nav>
      
    </aside>

    <main class="flex-1 overflow-y-auto bg-slate-900 relative">
      <slot /> </main>

  </div>
</template>