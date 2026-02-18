<script setup>
import { ref } from 'vue'
const route = useRoute()

const { data: lc, pending, error } = await useFetch(`/api/lightcone/${route.params.id}`)

// Track the current dropdown value (1-5)
const currentRank = ref(1)
</script>

<template>
  <div class="p-8 max-w-6xl mx-auto min-h-screen pb-20">
    
    <NuxtLink to="/lightcones" class="text-amber-400 hover:text-amber-300 mb-8 inline-block font-semibold transition-colors">
      &larr; Back to Lightcones
    </NuxtLink>

    <div v-if="pending" class="text-xl animate-pulse mt-10">Loading Database...</div>
    <div v-else-if="error" class="text-red-400 mt-10">Error loading lightcone data.</div>

    <div v-else-if="lc" class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      
      <div class="col-span-1 flex flex-col items-center bg-slate-800 p-6 rounded-3xl border border-slate-700 h-fit shadow-xl">
        <NuxtImg
          :src="`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${lc.portrait || lc.preview}`"
          class="w-full object-contain mb-6 drop-shadow-2xl"
          alt="Lightcone Portrait"
        />
        <h1 class="text-3xl font-bold mb-4 text-center text-slate-100">{{ lc.name }}</h1>
        <div class="flex space-x-2 text-sm font-semibold">
          <span :class="[
            'px-3 py-1 rounded-full',
            lc.rarity == 5 ? 'bg-yellow-500/20 text-yellow-300' : lc.rarity == 4 ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
          ]">
            {{ lc.rarity }}-Star
          </span>
          <span class="bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full border border-teal-500/30">
            {{ getOfficialPath(lc.path) }}
          </span>
        </div>
      </div>

      <div class="col-span-1 lg:col-span-2 space-y-6">
        
        <h2 class="text-2xl font-bold border-b border-slate-700 pb-2 mb-6">Lightcone Ability</h2>
        
        <div v-if="lc.skill" class="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg transition-all">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-2xl font-bold text-amber-400">{{ lc.skill.name }}</h3>
            
            <div class="relative">
              <select 
                v-model.number="currentRank" 
                class="appearance-none bg-amber-500/20 text-amber-300 font-bold px-4 py-1.5 rounded-md border border-amber-500/30 outline-none cursor-pointer hover:bg-amber-500/30 transition-colors pr-8 text-sm"
              >
                <option :value="1" class="bg-slate-800 text-amber-300">Superimposition 1</option>
                <option :value="2" class="bg-slate-800 text-amber-300">Superimposition 2</option>
                <option :value="3" class="bg-slate-800 text-amber-300">Superimposition 3</option>
                <option :value="4" class="bg-slate-800 text-amber-300">Superimposition 4</option>
                <option :value="5" class="bg-slate-800 text-amber-300">Superimposition 5</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-300">
                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
          
          <p class="text-slate-300 text-base leading-relaxed" v-html="parseHoyoMarkup(lc.skill.desc, lc.skill.params[currentRank - 1])"></p>
        </div>

        <div v-if="lc.desc" class="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 italic text-slate-400">
          <p v-html="parseHoyoMarkup(lc.desc)"></p>
        </div>

      </div>
    </div>
  </div>
</template>