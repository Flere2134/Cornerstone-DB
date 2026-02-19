<script setup>
import { ref } from 'vue'
const route = useRoute()

const { data: lc, pending, error } = await useFetch(`/api/lightcone/${route.params.id}`)

// Track the current dropdown value (1-5)
const currentRank = ref(1)

// Track the Lightcone Level (1-80)
const lcLevel = ref(80)

const getAscensionIndex = (level) => {
  if (level <= 20) return 0
  if (level <= 30) return 1
  if (level <= 40) return 2
  if (level <= 50) return 3
  if (level <= 60) return 4
  if (level <= 70) return 5
  return 6
}

// The bulletproof getStat formula, ported for Lightcones
const getStat = (statName, level) => {
  if (!lc.value?.promotions) return '---'
  
  const ascIndex = getAscensionIndex(level)
  
  let promoList = lc.value.promotions.values || lc.value.promotions
  if (!Array.isArray(promoList)) {
    promoList = Object.values(promoList)
  }

  const promoData = promoList[ascIndex]
  if (!promoData) return '---'

  const statsContainer = promoData.values || promoData
  let statInfo = null

  const statKeys = {
    'atk': ['atk', 'AttackBase', 'Attack', 'BaseAttack'],
    'def': ['def', 'DefenceBase', 'DefenseBase', 'Defence', 'Defense', 'BaseDefence', 'BaseDefense'],
    'hp':  ['hp', 'HPBase', 'MaxHPBase', 'MaxHP', 'BaseHP']
  }
  
  const possibleKeys = statKeys[statName] || [statName]

  if (Array.isArray(statsContainer)) {
    for (const item of statsContainer) {
      for (const k of possibleKeys) {
        if (item[k]) { statInfo = item[k]; break; }
      }
      if (statInfo) break;

      if (item.type && possibleKeys.includes(item.type)) {
        statInfo = item.value || item;
        break;
      }
    }
  } else {
    for (const k of possibleKeys) {
      if (statsContainer[k]) {
        statInfo = statsContainer[k]
        break;
      }
    }
  }

  if (!statInfo) return '---'

  const base = statInfo.base !== undefined ? statInfo.base : (statInfo.value || 0)
  const step = statInfo.step || 0
  
  return Math.round(base + (level - 1) * step)
}
</script>

<template>
  <div class="p-8 max-w-7xl mx-auto min-h-screen pb-20">
    
    <NuxtLink to="/lightcones" class="group flex items-center gap-2 text-slate-400 hover:text-amber-400 mb-8 font-semibold transition-colors w-fit">
      <span class="group-hover:-translate-x-1 transition-transform"> &larr;</span> Back to Lightcones
    </NuxtLink>

    <div v-if="pending" class="text-xl animate-pulse mt-10 text-slate-300">Loading Lightcone Data...</div>
    <div v-else-if="error" class="text-red-400 mt-10 bg-red-500/10 p-4 rounded-lg border border-red-500/20">Error loading data. Please try again later.</div>

    <div v-else-if="lc" class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      
      <div class="col-span-1 flex items-start justify-center lg:sticky lg:top-8 h-fit">
        <NuxtImg
          :src="`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${lc.portrait || lc.preview}`"
          class="w-full max-w-md object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] rounded-xl"
          alt="Lightcone Portrait"
        />
      </div>

      <div class="col-span-1 lg:col-span-2 space-y-10">
        
        <div>
          <h1 class="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">{{ lc.name }}</h1>
          <div class="flex items-center flex-wrap gap-4">
            <NuxtImg 
              :src="`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/deco/Star${lc.rarity}.png`" 
              class="h-7 w-auto object-contain drop-shadow-[0_2px_10px_rgba(251,191,36,0.3)]" 
              alt="Rarity Stars" 
            />
            
            <div class="flex items-center gap-2">
              <NuxtImg :src="`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/path/${getOfficialPath(lc.path)}.png`" class="w-6 h-6 opacity-90" />
              <span class="text-slate-300 font-medium">{{ getOfficialPath(lc.path) }}</span>
            </div>
          </div>
        </div>

        <div class="bg-slate-800/30 rounded-xl border border-slate-700/50 overflow-hidden">
          <table class="w-full border-collapse text-left text-sm">
            <tbody>
              <tr class="border-b border-slate-700/50 bg-slate-800/50">
                <th class="p-4 text-slate-400 font-semibold align-middle w-1/4 whitespace-nowrap">
                  Level <span class="text-teal-400 font-bold ml-2 text-base">{{ lcLevel }}</span>
                </th>
                <td class="p-4 w-3/4">
                   <div class="flex items-center gap-4 select-none">
                    <span class="text-xs font-bold text-slate-500">1</span>
                    <input 
                      type="range" min="1" max="80" step="1" 
                      v-model.number="lcLevel"
                      class="flex-1 h-1.5 bg-slate-700 rounded-full appearance-none cursor-pointer transition-all hover:bg-slate-600 focus:outline-none" 
                    />
                    <span class="text-xs font-bold text-slate-500">80</span>
                  </div>
                </td>
              </tr>
              <tr class="border-b border-slate-700/50">
                <th class="p-4 text-slate-400 font-semibold">HP</th>
                <td class="p-4 font-mono text-lg text-slate-200">{{ getStat('hp', lcLevel) }}</td>
              </tr>
              <tr class="border-b border-slate-700/50">
                <th class="p-4 text-slate-400 font-semibold">ATK</th>
                <td class="p-4 font-mono text-lg text-slate-200">{{ getStat('atk', lcLevel) }}</td>
              </tr>
              <tr>
                <th class="p-4 text-slate-400 font-semibold">DEF</th>
                <td class="p-4 font-mono text-lg text-slate-200">{{ getStat('def', lcLevel) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="lc.skill" class="bg-slate-800/80 p-6 lg:p-8 rounded-2xl border border-slate-700 shadow-lg">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-700/50 pb-4">
            <div>
              <h3 class="text-2xl font-bold text-white leading-tight">{{ lc.skill.name }}</h3>
            </div>
            
            <div class="relative flex-shrink-0">
              <select 
                v-model.number="currentRank" 
                class="appearance-none bg-slate-500/10 text-teal-400 font-bold pl-4 pr-10 py-2 rounded-lg border border-slate-500/20 outline-none cursor-pointer hover:bg-white-500/20 transition-colors text-sm"
              >
                <option :value="1" class="bg-slate-900 text-slate-400">1</option>
                <option :value="2" class="bg-slate-900 text-slate-400">2</option>
                <option :value="3" class="bg-slate-900 text-slate-400">3</option>
                <option :value="4" class="bg-slate-900 text-slate-400">4</option>
                <option :value="5" class="bg-slate-900 text-slate-400">5</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white-400">
                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
          
          <p class="text-slate-300 text-base leading-relaxed min-h-[60px]" v-html="parseHoyoMarkup(lc.skill.desc, lc.skill.params[currentRank - 1])"></p>
        </div>

        <div v-if="lc.desc">
           <div class="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 italic text-slate-300 leading-relaxed text-sm shadow-inner">
             <p v-html="parseHoyoMarkup(lc.desc)"></p>
           </div>
        </div>

      </div> </div>
  </div>
</template>