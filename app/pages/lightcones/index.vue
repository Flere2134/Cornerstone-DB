<script setup>
import { ref, computed } from 'vue'

// Fetch ALL lightcones from our new API
const { data: lightcones, pending, error } = await useFetch('/api/lightcones')

// --- FILTER STATE ---
const searchQuery = ref('')
const selectedRarity = ref(null) 
const selectedPath = ref(null)   

const availablePaths = ['Warrior', 'Rogue', 'Mage', 'Shaman', 'Warlock', 'Knight', 'Priest']

// --- FILTER LOGIC ---
const filteredLightcones = computed(() => {
  if (!lightcones.value) return []

  return lightcones.value.filter(lc => {
    const matchesSearch = lc.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRarity = selectedRarity.value ? lc.rarity === selectedRarity.value : true
    const matchesPath = selectedPath.value ? lc.path === selectedPath.value : true

    return matchesSearch && matchesRarity && matchesPath
  })
})

const toggleRarity = (rarity) => {
  selectedRarity.value = selectedRarity.value === rarity ? null : rarity
}
const togglePath = (path) => {
  selectedPath.value = selectedPath.value === path ? null : path
}
</script>

<template>
  <div class="p-8 md:p-8 max-w-5xl mx-auto pb-20 md:pb-20">
    
    <div class="mb-10 text-center">
      <h1 class="text-4xl font-bold mb-2 tracking-tight">Lightcones</h1>
      <p class="text-slate-400">Honkai:Star Rail</p>
    </div>

    <div class="max-w-4xl mx-auto mb-10 space-y-4">
      
      <div class="relative">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search lightcones by name..." 
          class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-5 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-inner"
        />
      </div>

      <div class="flex flex-wrap items-center justify-center gap-4">
        
        <div class="flex bg-slate-800/80 rounded-lg p-1 border border-slate-700 shadow-sm">
          <button @click="toggleRarity(5)" :class="['px-4 py-1.5 rounded-md text-sm font-bold transition-all', selectedRarity === 5 ? 'bg-yellow-500/20 text-yellow-400' : 'text-slate-400 hover:text-slate-200']">
            5★
          </button>
          <button @click="toggleRarity(4)" :class="['px-4 py-1.5 rounded-md text-sm font-bold transition-all', selectedRarity === 4 ? 'bg-purple-500/20 text-purple-400' : 'text-slate-400 hover:text-slate-200']">
            4★
          </button>
          <button @click="toggleRarity(3)" :class="['px-4 py-1.5 rounded-md text-sm font-bold transition-all', selectedRarity === 3 ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:text-slate-200']">
            3★
          </button>
        </div>

        <div class="flex bg-slate-800/80 rounded-lg p-1 border border-slate-700 shadow-sm gap-1">
          <button 
            v-for="path in availablePaths" 
            :key="path" 
            @click="togglePath(path)"
            :title="getOfficialPath(path)"
            :class="['p-1.5 rounded-md transition-all flex items-center justify-center', selectedPath === path ? 'bg-teal-500/20 border border-teal-500/30' : 'hover:bg-slate-700 border border-transparent']"
          >
            <NuxtImg 
              :src="`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/path/${getOfficialPath(path)}.png`" 
              width="24" height="24" 
              :class="['transition-opacity', selectedPath === path ? 'opacity-100' : 'opacity-50 hover:opacity-80']"
              alt="Path Icon"
            />
          </button>
        </div>

      </div>
    </div>
    
    <div v-if="pending" class="text-xl animate-pulse text-center mt-20">Loading Lightcones...</div>
    <div v-else-if="error" class="text-red-400 text-center mt-20">Error loading lightcones.</div>

    <div v-else-if="lightcones" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      
      <NuxtLink 
        v-for="lc in filteredLightcones" 
        :key="lc.id"
        :to="`/lightcones/${lc.id}`" 
        :class="[
          'group relative aspect-[9/14] rounded-xl overflow-hidden shadow-md border border-slate-700/50 transition-all duration-300 cursor-pointer',
          lc.rarity === 5 ? 'hover:border-amber-400 hover:shadow-[0_0_15px_-3px_rgba(251,191,36,0.3)]' : 
          lc.rarity === 4 ? 'hover:border-purple-400 hover:shadow-[0_0_15px_-3px_rgba(192,132,252,0.3)]' : 
          'hover:border-blue-400 hover:shadow-[0_0_15px_-3px_rgba(96,165,250,0.3)]'
        ]"
      >
        <NuxtImg
          v-if="lc.preview"
          :src="`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${lc.preview}`"
          loading="lazy"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 bg-slate-800"
          alt="Lightcone Preview"
        />
        <div v-else class="absolute inset-0 bg-slate-800"></div>

        <div 
          :class="[
            'absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent transition-colors duration-300 pt-12 pb-3 px-3 flex flex-col justify-end',
            lc.rarity === 5 ? 'group-hover:from-amber-700/60 group-hover:via-amber-500/60' : 
            lc.rarity === 4 ? 'group-hover:from-purple-900/90 group-hover:via-purple-800/60' : 
            'group-hover:from-blue-900/90 group-hover:via-blue-800/60'
          ]"
        >
          <h2 
            :class="[
              'font-bold truncate text-center text-sm shadow-sm transition-colors duration-300',
              lc.rarity === 5 ? 'text-white group-hover:text-amber-300' : 
              lc.rarity === 4 ? 'text-white group-hover:text-purple-300' : 
              'text-white group-hover:text-blue-300'
            ]"
          >
            {{ lc.name }}
          </h2>
        </div>
      </NuxtLink>

    </div>
    
    <div v-if="filteredLightcones.length === 0 && !pending" class="text-center mt-20 text-slate-400">
      <p class="text-xl font-semibold mb-2">No lightcones found</p>
      <p class="text-sm">Try adjusting your search or filters.</p>
    </div>

  </div>
</template>