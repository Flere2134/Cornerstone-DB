<script setup>
import { ref, computed } from 'vue'

// Fetch all relics from our new API
const { data: relics, pending, error } = await useFetch('/api/relics')

// --- FILTER STATE ---
const searchQuery = ref('')
const selectedType = ref('All') // 'All', 'Cavern', 'Planar'

// --- FILTER LOGIC ---
const filteredRelics = computed(() => {
  if (!relics.value) return []

  return relics.value.filter(relic => {
    const matchesSearch = relic.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // [Unverified] In StarRailRes, the 'desc' array holds the set effects.
    // Cavern Relics have a 2-pc and 4-pc (length of 2+). Planar Ornaments only have a 2-pc (length of 1).
    const isPlanar = relic.desc && relic.desc.length === 1
    const isCavern = relic.desc && relic.desc.length > 1
    
    let matchesType = true
    if (selectedType.value === 'Cavern') matchesType = isCavern
    if (selectedType.value === 'Planar') matchesType = isPlanar

    return matchesSearch && matchesType
  })
})
</script>

<template>
  <div class="p-8 max-w-6xl mx-auto pb-20">
    
    <div class="mb-10 text-center">
      <h1 class="text-4xl font-bold mb-2 tracking-tight text-slate-100">Relic & Planar Ornament Sets</h1>
      <p class="text-slate-400">Honkai:Star Rail</p>
    </div>

    <div class="max-w-4xl mx-auto mb-10 space-y-4">
      
      <div class="relative">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search relics by name" 
          class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-5 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all shadow-inner"
        />
      </div>

      <div class="flex flex-wrap items-center justify-center gap-4">
        
        <div class="flex bg-slate-800/80 rounded-lg p-1 border border-slate-700 shadow-sm">
          <button @click="selectedType = 'All'" :class="['px-4 py-1.5 rounded-md text-sm font-bold transition-all', selectedType === 'All' ? 'bg-teal-500/20 text-teal-400' : 'text-slate-400 hover:text-slate-200']">
            All Sets
          </button>
          <button @click="selectedType = 'Cavern'" :class="['px-4 py-1.5 rounded-md text-sm font-bold transition-all', selectedType === 'Cavern' ? 'bg-teal-500/20 text-teal-400' : 'text-slate-400 hover:text-slate-200']">
            Cavern Relics
          </button>
          <button @click="selectedType = 'Planar'" :class="['px-4 py-1.5 rounded-md text-sm font-bold transition-all', selectedType === 'Planar' ? 'bg-teal-500/20 text-teal-400' : 'text-slate-400 hover:text-slate-200']">
            Planar Ornaments
          </button>
        </div>

      </div>
    </div>
    
    <div v-if="pending" class="text-xl animate-pulse text-center mt-20 text-slate-300">Loading Relics...</div>
    <div v-else-if="error" class="text-red-400 text-center mt-20">Error loading relics.</div>

    <div v-else-if="relics" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
      
      <div 
        v-for="relic in filteredRelics" 
        :key="relic.id"
        class="group bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden shadow-lg hover:border-teal-400 hover:shadow-[0_0_15px_-3px_rgba(45,212,191,0.3)] transition-all duration-300 flex flex-col"
      >
        <div class="flex items-center gap-4 p-5 border-b border-slate-700 bg-slate-900/50 group-hover:bg-slate-800/80 transition-colors">
          <NuxtImg 
            v-if="relic.icon"
            :src="`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${relic.icon}`" 
            class="w-16 h-16 object-contain drop-shadow-md"
            alt="Relic Icon"
          />
          <h2 class="text-lg font-bold text-white leading-tight">{{ relic.name }}</h2>
        </div>
        
        <div class="p-6 flex-1 flex flex-col gap-5 text-sm text-slate-300 bg-slate-800/30">
          <div v-for="(effect, index) in relic.desc" :key="index">
            <span class="text-amber-400 font-bold block mb-1.5 uppercase text-xs tracking-wider">
              {{ index === 0 ? '2-Piece' : '4-Piece' }}
            </span>
            <p v-html="parseHoyoMarkup(effect)" class="leading-relaxed"></p>
          </div>
        </div>
      </div>

    </div>
    
    <div v-if="filteredRelics.length === 0 && !pending" class="text-center mt-20 text-slate-400">
      <p class="text-xl font-semibold mb-2">No relic sets found</p>
      <p class="text-sm">Try adjusting your search or filters.</p>
    </div>

  </div>
</template>