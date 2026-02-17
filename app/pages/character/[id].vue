<script setup>
const route = useRoute()

// We grab the dynamic ID from the URL (e.g., from /character/1304, we extract '1304')
const { data: character, pending, error } = await useFetch(`/api/character/${route.params.id}`)
</script>

<template>
  <div class="p-8 max-w-6xl mx-auto min-h-screen">
    
    <NuxtLink to="/" class="text-blue-400 hover:text-blue-300 mb-8 inline-block font-semibold">
      &larr; Back to Database
    </NuxtLink>

    <div v-if="pending" class="text-xl animate-pulse mt-10">Loading Database...</div>
    <div v-else-if="error" class="text-red-400 mt-10">Error loading character data.</div>

    <div v-else-if="character" class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      
      <div class="col-span-1 flex flex-col items-center bg-slate-800 p-6 rounded-3xl border border-slate-700 h-fit">
        <NuxtImg
          :src="`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${character.portrait}`"
          class="w-full object-contain mb-6 drop-shadow-2xl"
          alt="Character Portrait"
        />
        <h1 class="text-4xl font-bold mb-3 text-center">{{ getCharacterName(character.name) }}</h1>
        <div class="flex space-x-2 text-sm font-semibold mb-4">
          <span class="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full">{{ character.rarity }}-Star</span>
          <span class="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">{{ getOfficialPath(character.path) }}</span>
          <span class="bg-red-500/20 text-red-300 px-3 py-1 rounded-full">{{ character.element }}</span>
        </div>
      </div>

      <div class="col-span-1 lg:col-span-2 space-y-4">
        <h2 class="text-2xl font-bold border-b border-slate-700 pb-2 mb-6">Combat Kit</h2>
        
        <div 
          v-for="skill in character.kit" 
          :key="skill.id" 
          class="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex gap-5"
        >
          <NuxtImg
            v-if="skill.icon"
            :src="`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${skill.icon}`"
            width="64" height="64"
            class="rounded-full bg-slate-900 border-2 border-slate-600 flex-shrink-0"
            alt="Skill Icon"
          />
          
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-xl font-bold text-blue-300">{{ skill.name }}</h3>
              <span class="text-xs font-bold uppercase tracking-wider bg-slate-700 px-2 py-1 rounded text-slate-300">
                {{ skill.type_text || skill.type || 'Ability' }}
              </span>
            </div>
            
            <p class="text-slate-300 text-sm leading-relaxed" v-html="parseHoyoMarkup(skill.desc)"></p>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>