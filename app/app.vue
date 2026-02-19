<script setup>
// The Master Switch: Change this to 'true' to lock down the website!
const isMaintenanceMode = false 
</script>

<template>
  <div v-if="isMaintenanceMode" class="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-6 font-sans">
    <img src="/ipc-logo.png" alt="IPC Logo" class="w-20 h-20 mb-6 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] animate-pulse" />
    <h1 class="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 tracking-tight mb-4">
      Under Maintenance
    </h1>
    <p class="text-slate-400 text-lg max-w-md leading-relaxed">
      Cornerstone DB is currently undergoing system upgrades. Please check back later!
    </p>
  </div>

  <div v-else>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>