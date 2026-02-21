<script setup>
import { ref, computed } from 'vue'

const { data: characters, pending, error } = await useFetch('/api/characters')

// --- FILTER STATE ---
const searchQuery = ref('')
const selectedRarity = ref(null) 
const selectedPath = ref(null)   
const selectedElement = ref(null) // Added Element State

const availablePaths = ['Warrior', 'Rogue', 'Mage', 'Shaman', 'Warlock', 'Knight', 'Priest', 'Memory', 'Joy']

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
import { useRouter } from 'vue-router' // Add this to your imports if it isn't there!

const router = useRouter()
const isJackpotActive = ref(false)

// --- EASTER EGG LOGIC ---
const handleAventurineGamble = (e, character) => {
  // 1. Check if the clicked character is Aventurine
  if (getCharacterName(character.name) === 'Aventurine') {
    
    // 2. Roll the dice! (Math.random generates a decimal between 0 and 1)
    const roll = Math.random()
    
    // 3. The 1% Chance (For testing, change 0.01 to 1.0 so it triggers every time!)
    if (roll < 0.6) { // 60% chance for fun demonstration purposes
      e.preventDefault() // Stops the NuxtLink from instantly changing pages
      isJackpotActive.value = true // Triggers the golden overlay

      // 4. Wait 2.5 seconds, hide the overlay, and manually navigate
      setTimeout(() => {
        isJackpotActive.value = false
        router.push(`/character/${character.id}`)
      }, 2500)
    }
  }
}
</script>

<template>
  <div class="p-8 md:p-8 max-w-5xl mx-auto pb-20 md:pb-20">
    
    <div class="mb-10 text-center">
      <h1 class="text-4xl font-bold mb-2 tracking-tight">Characters</h1>
      <p class="text-slate-400">Honkai:Star Rail</p>
    </div>

    <div class="max-w-4xl mx-auto mb-10 space-y-4">
      
      <div class="relative">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search characters by name..." 
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
        </div>

        <div class="flex bg-slate-800/80 rounded-lg p-1 border border-slate-700 shadow-sm gap-1">
          <button 
            v-for="path in availablePaths" 
            :key="path" 
            @click="togglePath(path)"
            :title="getOfficialPath(path)"
            :class="['p-1.5 rounded-md transition-all flex items-center justify-center', selectedPath === path ? 'bg-teal-500/20 border-teal-500/30 ring-1 ring-teal-500/50' : 'hover:bg-slate-700 border border-transparent']"
          >
            <img 
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
            :class="['p-1.5 rounded-md transition-all flex items-center justify-center', selectedElement === element ? 'bg-teal-500/20 border-teal-500/30 ring-1 ring-teal-500/50' : 'hover:bg-slate-700 border border-transparent']"
          >
            <img 
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
        @click="handleAventurineGamble($event, character)"
        :class="[
          'group relative aspect-[9/14] rounded-xl overflow-hidden shadow-md border border-slate-700/50 transition-all duration-300 cursor-pointer',
          character.rarity === 5 
            ? 'hover:border-amber-400 hover:shadow-[0_0_15px_-3px_rgba(251,191,36,0.3)]' 
            : 'hover:border-purple-400 hover:shadow-[0_0_15px_-3px_rgba(192,132,252,0.3)]'
        ]"
      >
        <img
          v-if="character.preview"
          :src="`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${character.preview}`"
          loading="lazy"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 bg-slate-800"
          alt="Character Preview"
        />
        <div v-else class="absolute inset-0 bg-slate-800"></div>

        <div 
          :class="[
            'absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent transition-colors duration-300 pt-12 pb-3 px-3 flex flex-col justify-end',
            character.rarity === 5
              ? 'group-hover:from-amber-700/60 group-hover:via-amber-500/60'
              : 'group-hover:from-purple-900/90 group-hover:via-purple-800/60'
          ]"
        >
          <h2 
            :class="[
              'font-bold truncate text-center text-sm shadow-sm transition-colors duration-300',
              character.rarity === 5 ? 'text-white group-hover:text-amber-300' : 'text-white group-hover:text-purple-300'
            ]"
          >
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
  <div 
      v-if="isJackpotActive" 
      class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md transition-opacity duration-500"
    >
      <div class="text-center animate-bounce">
        <h1 class="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-amber-400 to-amber-600 drop-shadow-[0_0_50px_rgba(251,191,36,0.6)] tracking-widest italic select-none">
          JACKPOT!
        </h1>
        <p class="text-amber-300 mt-6 text-xl md:text-2xl font-bold uppercase tracking-widest animate-pulse select-none">
          All or nothing!
        </p>
      </div>
    </div>
</template>