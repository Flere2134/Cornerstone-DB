<script setup>
const route = useRoute()

// Fetch the specific Lightcone using the URL ID
const { data: lc, pending, error } = await useFetch(`/api/lightcone/${route.params.id}`)
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
        
        <div v-if="lc.skill" class="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-lg">
          <h3 class="text-2xl font-bold text-white-400 mb-4">{{ lc.skill.name }}</h3>
          
          <p class="text-slate-300 text-base leading-relaxed" v-html="parseHoyoMarkup(lc.skill.desc)"></p>
        </div>

        <div v-if="lc.desc" class="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 italic text-slate-400">
          <p v-html="parseHoyoMarkup(lc.desc)"></p>
        </div>

      </div>
    </div>
  </div>
</template>