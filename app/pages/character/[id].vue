<script setup>
import { computed, reactive, ref, watch } from 'vue'
const route = useRoute()

const { data: character, pending, error } = await useFetch(`/api/character/${route.params.id}`)

const skillLevels = reactive({})
const charLevel = ref(80) // Set default to Max Level 80

watch(character, (newChar) => {
  if (newChar && newChar.kit) {
    newChar.kit.forEach(skill => {
      // This forces the slider's starting value to be exactly 1
      skillLevels[skill.id] = 1 
    })
  }
  if (newChar && newChar.servant && newChar.servant.skills) {
    newChar.servant.skills.forEach(skill => {
      skillLevels[skill.id] = 1 
    })
  }
}, { immediate: true })

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

// --- SORTING HIERARCHY ---
const leftOrder = ['Basic ATK', 'Ultimate', 'Technique']
const rightOrder = ['Skill', 'Talent']

const leftAbilities = computed(() => {
  if (!character.value?.kit) return []
  
  return character.value.kit
    .filter(s => leftOrder.includes(s.type_text))
    .sort((a, b) => {
      // Sorts by our predefined hierarchy so duplicate types stick together
      const typeDiff = leftOrder.indexOf(a.type_text) - leftOrder.indexOf(b.type_text)
      // If they are the exact same type, sort them by their internal ID to keep them predictable
      return typeDiff === 0 ? String(a.id).localeCompare(String(b.id)) : typeDiff
    })
})

const rightAbilities = computed(() => {
  if (!character.value?.kit) return []
  
  return character.value.kit
    .filter(s => rightOrder.includes(s.type_text))
    .sort((a, b) => {
      const typeDiff = rightOrder.indexOf(a.type_text) - rightOrder.indexOf(b.type_text)
      return typeDiff === 0 ? String(a.id).localeCompare(String(b.id)) : typeDiff
    })
})
</script>

<template>
  <div class="p-4 md:p-8 max-w-[1400px] mx-auto min-h-screen pb-20 md:pb-20">
    
    <NuxtLink to="/" class="text-slate-400 hover:text-amber-400 mb-8 inline-block font-semibold transition-colors">
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

        <div class="overflow-x-auto w-full pb-2">
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
                    class="w-full h-1.5 bg-slate-700 rounded-full appearance-none cursor-pointer accent-teal-400 transition-all hover:bg-slate-600 focus:outline-none" 
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
                <th class="p-4 bg-slate-800/80 text-slate-400 font-semibold align-middle">Rarity</th>
                <td class="p-4">
                  <NuxtImg 
                    :src="`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/icon/deco/Star${character.rarity}.png`" 
                    class="h-6 w-auto object-contain drop-shadow-md" 
                    alt="Rarity Stars" 
                  />
                </td>
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
          <div v-if="character.description" class="mt-4 bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 italic text-slate-300 leading-relaxed text-sm shadow-inner">
            <p v-html="parseHoyoMarkup(character.description)"></p>
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
                <div class="flex items-center gap-3 flex-wrap">
                  <h3 class="text-xl font-bold text-white">{{ skill.name }}</h3>
                  <span 
                    v-if="skill.effect_text" 
                    class="text-[0.65rem] bg-slate-700 px-2 py-0.5 rounded text-slate-300 font-semibold border border-slate-600 uppercase tracking-wider"
                  >
                    {{ skill.effect_text }}
                  </span>
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
                <div class="flex items-center gap-3 flex-wrap">
                  <h3 class="text-xl font-bold text-white">{{ skill.name }}</h3>
                  <span 
                    v-if="skill.effect_text" 
                    class="text-[0.65rem] bg-slate-700 px-2 py-0.5 rounded text-slate-300 font-semibold border border-slate-600 uppercase tracking-wider"
                  >
                    {{ skill.effect_text }}
                  </span>
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

      <div v-if="character.servant" class="mb-12">
        <h2 class="text-3xl font-bold border-b border-slate-700 pb-3 mb-8 text-slate-100 flex items-center gap-3">
          Memosprite: {{ character.servant.name }}
        </h2>

        <div class="flex flex-col items-center justify-center mb-10">
          <div class="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-slate-800/50 border-2 border-teal-500/30 p-3 shadow-[0_0_30px_rgba(45,212,191,0.15)]">
            <div class="absolute inset-0 rounded-full bg-teal-500/10 animate-pulse"></div>
            <NuxtImg 
              :src="`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${character.servant.icon}`" 
              class="w-full h-full object-contain drop-shadow-xl relative z-10"
              :alt="character.servant.name"
            />
          </div>
          <h3 class="mt-5 text-2xl font-bold text-teal-400 tracking-wide">{{ character.servant.name }}</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="skill in character.servant.skills" 
            :key="skill.id"
            class="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 relative overflow-hidden group hover:border-teal-500/30 transition-all duration-300 shadow-md"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div class="relative flex items-start gap-5">
              <div class="flex-shrink-0 flex flex-col items-center gap-2.5">
                <div class="p-2.5 bg-slate-900 rounded-full border-2 border-slate-600 shadow-md group-hover:border-teal-500/50 transition-colors">
                  <NuxtImg 
                    :src="`https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${skill.icon}`" 
                    class="w-10 h-10 object-contain"
                    :alt="skill.name"
                  />
                </div>
                <span class="text-[0.6rem] font-bold text-teal-400 uppercase tracking-widest text-center">{{ skill.type_text }}</span>
              </div>

              <div class="flex-1 space-y-2.5">
                <div class="flex items-center gap-3 flex-wrap">
                  <h3 class="text-lg font-bold text-white group-hover:text-teal-200 transition-colors">{{ skill.name }}</h3>
                  <span 
                    v-if="skill.effect_text" 
                    class="text-[0.65rem] bg-slate-700 px-2 py-0.5 rounded text-slate-300 font-semibold border border-slate-600 uppercase tracking-wider"
                  >
                    {{ skill.effect_text }}
                  </span>
                </div>
                <p class="text-sm text-slate-300 leading-relaxed mb-4 min-h-[60px]" 
                   v-html="parseHoyoMarkup(skill.desc, skill.params[(skillLevels[skill.id] || 1) - 1] || skill.params)">
                </p>

                <div v-if="skill.params && skill.params.length > 1" class="mt-2 flex items-center gap-4 select-none">
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
        </div>
      </div>

      <h2 class="text-3xl font-bold border-b border-slate-700 pb-3 mb-8 text-slate-100">Bonus Abilities</h2>
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
              <h3 class="font-bold text-lg text-white-400 mb-2">{{ index + 1 }}. {{ ability.name }}</h3>
              <p class="text-sm text-slate-300 leading-relaxed" v-html="parseHoyoMarkup(ability.desc, ability.params)"></p>
            </div>
          </div>
        </div>

        <div class="bg-slate-800/50 p-6 rounded-xl border border-slate-700 h-fit">
          <h3 class="font-bold text-slate-300 mb-4 uppercase tracking-wider text-sm border-b border-slate-700 pb-2">Traces</h3>
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
            <p class="text-sm text-slate-300 leading-relaxed" v-html="parseHoyoMarkup(eidolon.desc, (eidolon.params || []).flat())"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>