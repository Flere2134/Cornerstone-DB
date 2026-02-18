<script setup>
import { computed, reactive, ref } from 'vue' // Make sure ref is imported!
const route = useRoute()

const { data: character, pending, error } = await useFetch(`/api/character/${route.params.id}`)

const skillLevels = reactive({})
const charLevel = ref(80) // Set default to Max Level 80

// Determine which Ascension bracket the character is in
const getAscensionIndex = (level) => {
  if (level <= 20) return 0
  if (level <= 30) return 1
  if (level <= 40) return 2
  if (level <= 50) return 3
  if (level <= 60) return 4
  if (level <= 70) return 5
  return 6
}

// Automatically calculate the precise stat based on their current level
// Automatically calculate the precise stat based on their current level
// Automatically calculate the precise stat based on their current level
// Automatically calculate the precise stat based on their current level
const getStat = (statName, level) => {
  if (!character.value?.promotions) return '---'
  
  const ascIndex = getAscensionIndex(level)
  
  // 1. Grab the array safely! (We check for the .values wrapper FIRST before flattening)
  let promoList = character.value.promotions.values || character.value.promotions
  
  // Force the data into an array ONLY if it's still a flat object
  if (!Array.isArray(promoList)) {
    promoList = Object.values(promoList)
  }

  const promoData = promoList[ascIndex]
  if (!promoData) return '---'

  const statsContainer = promoData.values || promoData
  let statInfo = null

  // 2. The Rosetta Stone: Maps your simple names to Hoyoverse's internal engine names
  const statKeys = {
    'atk': ['atk', 'AttackBase', 'Attack', 'BaseAttack'],
    'def': ['def', 'DefenceBase', 'DefenseBase', 'Defence', 'Defense', 'BaseDefence', 'BaseDefense'],
    'hp':  ['hp', 'HPBase', 'MaxHPBase', 'MaxHP', 'BaseHP'],
    'spd': ['spd', 'SpeedBase', 'Speed', 'BaseSpeed'],
    'taunt': ['taunt', 'BaseAggro', 'Aggro', 'BaseTaunt']
  }
  
  const possibleKeys = statKeys[statName] || [statName]

  // 3. Deep search through the container
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
    // If it's a flat object
    for (const k of possibleKeys) {
      if (statsContainer[k]) {
        statInfo = statsContainer[k]
        break;
      }
    }
  }

  // 4. Final safety fallback
  if (!statInfo) return '---'

  const base = statInfo.base !== undefined ? statInfo.base : (statInfo.value || 0)
  const step = statInfo.step || 0
  
  return Math.round(base + (level - 1) * step)
}
const leftAbilities = computed(() => {
  if (!character.value?.kit) return []
  return character.value.kit.filter(s => ['Basic ATK', 'Ultimate', 'Technique'].includes(s.type_text))
})

const rightAbilities = computed(() => {
  if (!character.value?.kit) return []
  return character.value.kit.filter(s => ['Skill', 'Talent'].includes(s.type_text))
})
</script>

<template>
  <div class="p-8 max-w-[1400px] mx-auto min-h-screen pb-20">
    
    <NuxtLink to="/" class="text-teal-400 hover:text-teal-300 mb-8 inline-block font-semibold transition-colors">
      &larr; Back to Database
    </NuxtLink>

    <div v-if="pending" class="text-xl animate-pulse mt-10">Loading Database...</div>
    <div v-else-if="error" class="text-red-400 mt-10">Error loading character data.</div>

    <div v-else-if="character">
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        
        <div class="flex justify-center items-start">
          <NuxtImg
            :src="`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${character.portrait}`"
            class="w-full max-w-lg object-contain drop-shadow-[0_0_30px_rgba(45,212,191,0.2)]"
            alt="Character Portrait"
          />
        </div>

        <div>
          <table class="w-full border-collapse border border-slate-700 text-left text-sm mb-6 bg-slate-800/30 rounded-lg overflow-hidden shadow-lg shadow-black/20">
            <tbody>
              <tr class="border-b border-slate-700">
                <th class="p-4 bg-slate-800/80 w-1/3 text-slate-400 font-semibold">Name</th>
                <td class="p-4 font-bold text-white text-lg">{{ character.name }}</td>
              </tr>
              
              <tr class="border-b border-slate-700">
                <th class="p-4 bg-slate-800/80 text-slate-400 font-semibold align-middle">
                  Level <span class="text-teal-400 font-bold ml-1">{{ charLevel }}</span>
                </th>
                <td class="p-4">
                  <input 
                    type="range" min="1" max="80" step="1" 
                    v-model.number="charLevel"
                    class="w-full h-1.5 bg-slate-700 rounded-full appearance-none cursor-pointer accent-teal-400 transition-all hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/30" 
                  />
                </td>
              </tr>

              <tr class="border-b border-slate-700">
                <th class="p-4 bg-slate-800/80 text-slate-400 font-semibold">ATK</th>
                <td class="p-4 font-medium text-slate-200">{{ getStat('atk', charLevel) }}</td>
              </tr>
              <tr class="border-b border-slate-700">
                <th class="p-4 bg-slate-800/80 text-slate-400 font-semibold">DEF</th>
                <td class="p-4 font-medium text-slate-200">{{ getStat('def', charLevel) }}</td>
              </tr>
              <tr class="border-b border-slate-700">
                <th class="p-4 bg-slate-800/80 text-slate-400 font-semibold">HP</th>
                <td class="p-4 font-medium text-slate-200">{{ getStat('hp', charLevel) }}</td>
              </tr>
              <tr class="border-b border-slate-700">
                <th class="p-4 bg-slate-800/80 text-slate-400 font-semibold">SPD</th>
                <td class="p-4 font-medium text-slate-200">{{ getStat('spd', charLevel) }}</td>
              </tr>
              <tr class="border-b border-slate-700">
                <th class="p-4 bg-slate-800/80 text-slate-400 font-semibold">Aggro</th>
                <td class="p-4 font-medium text-slate-200">{{ getStat('taunt', charLevel) }}</td>
              </tr>

              <tr class="border-b border-slate-700">
                <th class="p-4 bg-slate-800/80 text-slate-400 font-semibold">Rarity</th>
                <td class="p-4 text-yellow-400 text-lg tracking-widest">{{ '★'.repeat(character.rarity) }}</td>
              </tr>
              <tr class="border-b border-slate-700">
                <th class="p-4 bg-slate-800/80 text-slate-400 font-semibold">Element</th>
                <td class="p-4 flex items-center gap-2 font-medium">
                  <NuxtImg :src="`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/element/${character.element}.png`" class="w-5 h-5" />
                  {{ character.element === 'Thunder' ? 'Lightning' : character.element }}
                </td>
              </tr>
              <tr>
                <th class="p-4 bg-slate-800/80 text-slate-400 font-semibold">Path</th>
                <td class="p-4 flex items-center gap-2 font-medium">
                  <NuxtImg :src="`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/path/${getOfficialPath(character.path)}.png`" class="w-5 h-5 opacity-90 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                  {{ getOfficialPath(character.path) }}
                </td>
              </tr>
            </tbody>
          </table>
          <div class="p-6 bg-slate-800/50 rounded-xl border border-slate-700 text-slate-300 leading-relaxed shadow-inner">
            <p v-html="parseHoyoMarkup(character.desc)"></p>
          </div>
        </div>
      </div>

      <h2 class="text-3xl font-bold border-b border-slate-700 pb-3 mb-8 text-slate-100">Abilities</h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        
        <div class="space-y-8">
          <div v-for="skill in leftAbilities" :key="skill.id" class="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-md">
            <div class="flex items-center gap-4 mb-4">
              <NuxtImg v-if="skill.icon" :src="`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${skill.icon}`" class="w-14 h-14 rounded-full bg-slate-900 border-2 border-slate-600" />
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-teal-400 mb-1 block">{{ skill.type_text }}</span>
                <div class="flex items-center gap-3">
                  <h3 class="text-xl font-bold text-white">{{ skill.name }}</h3>
                  <span class="text-[0.65rem] bg-slate-700 px-2 py-0.5 rounded text-slate-300 font-semibold border border-slate-600">Single Target</span>
                </div>
              </div>
            </div>
            <p class="text-slate-300 text-sm leading-relaxed mb-6 min-h-[80px]" 
               v-html="parseHoyoMarkup(skill.desc, skill.params[(skillLevels[skill.id] || 1) - 1])">
            </p>
            
            <div v-if="skill.params && skill.params.length > 1" class="mt-4 mb-6 flex items-center gap-4 select-none">
               <span class="text-xs font-bold text-slate-500">Lv.1</span>

               <input 
                 type="range" min="1" :max="skill.params.length" step="1" 
                 v-model.number="skillLevels[skill.id]"
                 class="flex-1 h-1.5 bg-slate-700 rounded-full appearance-none cursor-pointer accent-teal-400 transition-all hover:bg-slate-600"
               />

               <span class="text-xs font-bold text-teal-400 whitespace-nowrap">
                  Lv. {{ skillLevels[skill.id] || 1 }} <span class="text-slate-500">/ {{ skill.params.length }}</span>
               </span>
            </div>
          </div>
        </div>

        <div class="space-y-8">
          <div v-for="skill in rightAbilities" :key="skill.id" class="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-md">
            <div class="flex items-center gap-4 mb-4">
              <NuxtImg v-if="skill.icon" :src="`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${skill.icon}`" class="w-14 h-14 rounded-full bg-slate-900 border-2 border-slate-600" />
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-teal-400 mb-1 block">{{ skill.type_text }}</span>
                <div class="flex items-center gap-3">
                  <h3 class="text-xl font-bold text-white">{{ skill.name }}</h3>
                </div>
              </div>
            </div>
            <p class="text-slate-300 text-sm leading-relaxed mb-6 min-h-[80px]" 
               v-html="parseHoyoMarkup(skill.desc, skill.params[(skillLevels[skill.id] || 1) - 1])">
            </p>
            
            <div v-if="skill.params && skill.params.length > 1" class="mt-4 mb-6 flex items-center gap-4 select-none">
               <span class="text-xs font-bold text-slate-500">Lv.1</span>

               <input 
                 type="range" min="1" :max="skill.params.length" step="1" 
                 v-model.number="skillLevels[skill.id]"
                 class="flex-1 h-1.5 bg-slate-700 rounded-full appearance-none cursor-pointer accent-teal-400 transition-all hover:bg-slate-600"
               />

               <span class="text-xs font-bold text-teal-400 whitespace-nowrap">
                  Lv. {{ skillLevels[skill.id] || 1 }} <span class="text-slate-500">/ {{ skill.params.length }}</span>
               </span>
            </div>
          </div>
        </div>

      </div>

      <h2 class="text-3xl font-bold border-b border-slate-700 pb-3 mb-8 text-slate-100">Bonus Abilities & Traces</h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        
        <div class="space-y-4">
          <div 
            v-for="(ability, index) in character.bonus_abilities" 
            :key="ability.id" 
            class="bg-slate-800/50 p-5 rounded-xl border border-slate-700 flex gap-4 items-start"
          >
            <NuxtImg 
              v-if="ability.icon" 
              :src="`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${ability.icon}`" 
              class="w-12 h-12 bg-slate-900 rounded-full border border-slate-600 flex-shrink-0" 
            />
            <div>
              <h3 class="font-bold text-lg text-amber-400 mb-2">{{ index + 1 }}. {{ ability.name }}</h3>
              <p class="text-sm text-slate-300 leading-relaxed" v-html="parseHoyoMarkup(ability.desc)"></p>
            </div>
          </div>
        </div>

        <div class="bg-slate-800/50 p-6 rounded-xl border border-slate-700 h-fit">
          <h3 class="font-bold text-slate-300 mb-4 uppercase tracking-wider text-sm border-b border-slate-700 pb-2">Max Ascension Stats</h3>
          <ul class="space-y-4">
            <li 
              v-for="stat in character.stat_totals" 
              :key="stat.name" 
              class="flex justify-between items-center text-slate-200"
            >
              <span class="flex items-center gap-3 font-semibold">
                
                <NuxtImg 
                  v-if="stat.icon" 
                  :src="`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${stat.icon}`" 
                  class="w-6 h-6 object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]" 
                  alt="Stat Icon"
                />
                <div v-else class="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs">✨</div> 
                {{ stat.name }}
              </span>
              <span class="font-mono text-teal-400 font-bold">{{ stat.value }}</span>
            </li>
          </ul>
        </div>
      </div>

      <h2 class="text-3xl font-bold border-b border-slate-700 pb-3 mb-8 text-slate-100">Eidolons</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div v-for="(eidolon, index) in character.eidolons" :key="eidolon.id" class="flex gap-5 bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-lg hover:border-teal-500/50 transition-colors">
          <NuxtImg 
            v-if="eidolon.icon" 
            :src="`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${eidolon.icon}`" 
            class="w-20 h-20 rounded-full bg-slate-900 border-2 border-slate-600 flex-shrink-0 object-cover" 
          />
          <div>
            <h3 class="text-lg font-bold text-white mb-2 leading-tight">
              <span class="text-teal-400 mr-2">{{ index + 1 }}.</span>{{ eidolon.name }}
            </h3>
            <p class="text-sm text-slate-300 leading-relaxed" v-html="parseHoyoMarkup(eidolon.desc)"></p>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>