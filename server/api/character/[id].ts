// server/api/character/[id].ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') as string
  
  const [rawChars, rawSkills, rawRanks, rawTrees] = await Promise.all([
    $fetch<string>('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en/characters.json', { responseType: 'text' }),
    $fetch<string>('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en/character_skills.json', { responseType: 'text' }),
    $fetch<string>('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en/character_ranks.json', { responseType: 'text' }),
    $fetch<string>('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en/character_skill_trees.json', { responseType: 'text' })
  ])
  
  const chars = JSON.parse(rawChars)
  const skillsData = JSON.parse(rawSkills)
  const ranksData = JSON.parse(rawRanks)
  const treesData = JSON.parse(rawTrees)
  
  const character = chars[id]
  
  if (character) {
    if (character.skills) {
      character.kit = character.skills.map((skillId: string) => skillsData[skillId])
    }
    
    if (character.ranks) {
      character.eidolons = character.ranks.map((rankId: string) => ranksData[rankId])
    }

    if (character.skill_trees) {
      const bonusAbilities: any[] = []
      const statTotals: Record<string, { value: number, isPercent: boolean }> = {}

      // UPDATED: Fixed 'HPAddedRatio' to match Hoyoverse's actual internal naming
      const statTypeMap: Record<string, { name: string, isPercent: boolean }> = {
        'DefenseAddedRatio': { name: 'DEF', isPercent: true },
        'AttackAddedRatio': { name: 'ATK', isPercent: true },
        'HPAddedRatio': { name: 'Max HP', isPercent: true },
        'CriticalChanceBase': { name: 'CRIT Rate', isPercent: true },
        'CriticalDamageBase': { name: 'CRIT DMG', isPercent: true },
        'SpeedDelta': { name: 'SPD', isPercent: false },
        'StatusProbabilityBase': { name: 'Effect Hit Rate', isPercent: true },
        'StatusResistanceBase': { name: 'Effect RES', isPercent: true },
        'PhysicalAddedRatio': { name: 'Physical DMG Boost', isPercent: true },
        'FireAddedRatio': { name: 'Fire DMG Boost', isPercent: true },
        'IceAddedRatio': { name: 'Ice DMG Boost', isPercent: true },
        'ThunderAddedRatio': { name: 'Lightning DMG Boost', isPercent: true },
        'WindAddedRatio': { name: 'Wind DMG Boost', isPercent: true },
        'QuantumAddedRatio': { name: 'Quantum DMG Boost', isPercent: true },
        'ImaginaryAddedRatio': { name: 'Imaginary DMG Boost', isPercent: true },
        'BreakDamageAddedRatioBase': { name: 'Break Effect', isPercent: true },
        'HealRatioBase': { name: 'Outgoing Healing Boost', isPercent: true },
      }

      character.skill_trees.forEach((treeId: string) => {
        const node = treesData[treeId]
        if (!node) return

        const hasStats = node.levels?.[0]?.properties?.length > 0

        if (node.desc && node.max_level === 1 && !hasStats) {
          bonusAbilities.push({
            id: node.id,
            name: node.name,
            desc: node.desc,
            icon: node.icon
          })
        }

        if (hasStats) {
          node.levels[0].properties.forEach((prop: any) => {
            // UPDATED: Added explicit 'as string' assertions to clear the TypeScript errors!
            const propType = prop.type as string
            const statInfo = statTypeMap[propType] || { name: propType, isPercent: false }
            const statName = statInfo.name as string
            
            if (!statTotals[statName]) {
              statTotals[statName] = { value: 0, isPercent: statInfo.isPercent }
            }
            statTotals[statName].value += prop.value
          })
        }
      })

      character.stat_totals = Object.entries(statTotals).map(([key, stat]) => {
        const formatted = stat.isPercent ? `${+(stat.value * 100).toFixed(1)}%` : `${+stat.value.toFixed(1)}`
        return { name: key, value: formatted }
      })

      character.bonus_abilities = bonusAbilities.splice(-3)
    }
    
    return character
  } else {
    throw createError({ statusCode: 404, statusMessage: 'Character not found' })
  }
})