<script setup>
import { ref, computed } from 'vue'

const { data: characters, pending, error } = await useFetch('/api/characters')

// --- FILTER STATE ---
const searchQuery = ref('')
const selectedRarity = ref(null) 
const selectedPath = ref(null)   
const selectedElement = ref(null) // Added Element State

const availablePaths = ['Warrior', 'Rogue', 'Mage', 'Shaman', 'Warlock', 'Knight', 'Priest']

// The internal Hoyoverse codenames for the 7 elements
const availableElements = ['Fire', 'Ice', 'Wind', 'Thunder', 'Physical', 'Quantum', 'Imaginary']

// --- FILTER LOGIC ---
const filteredCharacters = computed(() => {
  if (!characters.value) return []

  return characters.value.filter(char => {
    const matchesSearch = getCharacterName(char.name).toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRarity = selectedRarity.value ? char.rarity === selectedRarity.value : true
    const matchesPath = selectedPath.value ? char.path === selectedPath.value : true
    
    // Check if the element matches (or if no element is selected)
    const matchesElement = selectedElement.value ? char.element === selectedElement.value : true

    // All conditions must be true to show the character
    return matchesSearch && matchesRarity && matchesPath && matchesElement
  })
})

const toggleRarity = (rarity) => {
  selectedRarity.value = selectedRarity.value === rarity ? null : rarity
}
const togglePath = (path) => {
  selectedPath.value = selectedPath.value === path ? null : path
}
const toggleElement = (element) => {
  selectedElement.value = selectedElement.value === element ? null : element
}
</script>

<template>
  <div class="p-8 max-w-5xl mx-auto pb-20">
    
    <div class="mb-10 text-center">
      <h1 class="text-4xl font-bold mb-2 tracking-tight">Archive/Characters</h1>
      <p class="text-slate-400">Honkai: Star Rail</p>
    </div>

    <div class="max-w-4xl mx-auto mb-10 space-y-4">
      
      <div class="relative">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search characters by name..." 
          class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-5 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
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
        </div>

        <div class="flex bg-slate-800/80 rounded-lg p-1 border border-slate-700 shadow-sm gap-1">
          <button 
            v-for="path in availablePaths" 
            :key="path" 
            @click="togglePath(path)"
            :title="getOfficialPath(path)"
            :class="['p-1.5 rounded-md transition-all flex items-center justify-center', selectedPath === path ? 'bg-blue-500/20 border border-blue-500/30' : 'hover:bg-slate-700 border border-transparent']"
          >
            <NuxtImg 
              :src="`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/path/${getOfficialPath(path)}.png`" 
              width="24" height="24" 
              :class="['transition-opacity', selectedPath === path ? 'opacity-100' : 'opacity-50 hover:opacity-80']"
              alt="Path Icon"
            />
          </button>
        </div>

        <div class="flex bg-slate-800/80 rounded-lg p-1 border border-slate-700 shadow-sm gap-1">
          <button 
            v-for="element in availableElements" 
            :key="element" 
            @click="toggleElement(element)"
            :title="element === 'Thunder' ? 'Lightning' : element"
            :class="['p-1.5 rounded-md transition-all flex items-center justify-center', selectedElement === element ? 'bg-blue-500/20 border border-blue-500/30' : 'hover:bg-slate-700 border border-transparent']"
          >
            <NuxtImg 
              :src="`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/element/${element}.png`" 
              width="24" height="24" 
              :class="['transition-opacity', selectedElement === element ? 'opacity-100' : 'opacity-50 hover:opacity-80']"
              alt="Element Icon"
            />
          </button>
        </div>

      </div>
    </div>
    <div v-if="pending" class="text-xl animate-pulse text-center mt-20">Loading Database...</div>
    <div v-else-if="error" class="text-red-400 text-center mt-20">Error loading characters.</div>

    <div v-else-if="characters" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      
      <NuxtLink 
        v-for="character in filteredCharacters" 
        :key="character.id"
        :to="`/character/${character.id}`" 
        class="group relative aspect-[9/14] rounded-xl overflow-hidden shadow-md border border-slate-700/50 hover:border-blue-400 hover:shadow-blue-500/30 transition-all duration-300 cursor-pointer"
      >
        <NuxtImg
          v-if="character.preview"
          :src="`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${character.preview}`"
          loading="lazy"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 bg-slate-800"
          alt="Character Preview"
        />
        <div v-else class="absolute inset-0 bg-slate-800"></div>

        <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent pt-12 pb-3 px-3 flex flex-col justify-end">
          <h2 class="text-white font-bold truncate text-center text-sm shadow-sm">
            {{ getCharacterName(character.name) }}
          </h2>
        </div>
      </NuxtLink>

    </div>
    
    <div v-if="filteredCharacters.length === 0 && !pending" class="text-center mt-20 text-slate-400">
      <p class="text-xl font-semibold mb-2">No characters found</p>
      <p class="text-sm">Try adjusting your search or filters.</p>
    </div>

  </div>
</template>