// server/api/character/[id].ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') as string
  
  // 1. Added rawPromotions to the master fetch list
  const [rawChars, rawSkills, rawRanks, rawTrees, rawProps, rawPromotions, rawDesc] = await Promise.all([
    $fetch<string>('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en/characters.json', { responseType: 'text' }),
    $fetch<string>('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en/character_skills.json', { responseType: 'text' }),
    $fetch<string>('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en/character_ranks.json', { responseType: 'text' }),
    $fetch<string>('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en/character_skill_trees.json', { responseType: 'text' }),
    $fetch<string>('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en/properties.json', { responseType: 'text' }),
    $fetch<string>('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en/character_promotions.json', { responseType: 'text' }),
    $fetch<string>('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en/descriptions.json', { responseType: 'text' })
  ])
  
  const chars = JSON.parse(rawChars)
  const skillsData = JSON.parse(rawSkills)
  const ranksData = JSON.parse(rawRanks)
  const treesData = JSON.parse(rawTrees)
  const propsData = JSON.parse(rawProps)
  const promosData = JSON.parse(rawPromotions)
  const descData = JSON.parse(rawDesc)
  
  const character = chars[id]
  
  if (character) {
    // We bypass the ID mismatch by searching the database for the matching character name!
    const charDesc = Object.values(descData).find((d: any) => d.title === character.name)
    
    if (charDesc) {
      character.description = String((charDesc as any).desc).replace(/\{NICKNAME\}/g, 'Trailblazer')
    }
    // --- NEW: Unified Kit & Memosprite Extraction ---
    const mainKitTypes = ['Basic ATK', 'Skill', 'Ultimate', 'Talent', 'Technique'];
    const mainKitSkills: any[] = [];
    const memospriteSkills: any[] = [];
    const allPossibleSkillIds = new Set<string>();

    // 1. Gather EVERY single skill ID attached to this character from ALL sources
    if (character.skills) {
      character.skills.forEach((id: string) => allPossibleSkillIds.add(String(id)));
    }
    if (character.skill_trees) {
      character.skill_trees.forEach((treeId: string) => {
        const node = treesData[treeId];
        if (node?.level_up_skills) {
          node.level_up_skills.forEach((lvl: any) => allPossibleSkillIds.add(String(lvl.id)));
        }
      });
    }
    Object.values(treesData).forEach((node: any) => {
      if (String(node.id).startsWith(id)) {
        if (node?.level_up_skills) {
          node.level_up_skills.forEach((lvl: any) => allPossibleSkillIds.add(String(lvl.id)));
        }
      }
    });

    // 2. Filter and separate them into Main Kit vs Memosprite
    allPossibleSkillIds.forEach(skillId => {
      const skillNode = skillsData[skillId];
      if (skillNode) {
        if (mainKitTypes.includes(skillNode.type_text)) {
          // It's a normal ability
          if (!mainKitSkills.find(s => s.id === skillNode.id)) {
             mainKitSkills.push(skillNode); 
          }
        } else {
          // If it isn't one of the 5 main types, it's a Memosprite ability!
          if (!memospriteSkills.find(s => s.id === skillNode.id)) {
             if (!skillNode.type_text) skillNode.type_text = 'Memosprite Skill';
             memospriteSkills.push(skillNode); 
          }
        }
      }
    });

    character.kit = mainKitSkills;

    // 3. Construct the servant object
    if (memospriteSkills.length > 0) {
      let memospriteName = "Memosprite";
      
      // Strategy A: Check the ENTIRE main kit for the explicit phrase "memosprite [Name]"
      const mainKitDesc = character.kit.map((s: any) => s.desc).join(' | ');
      // Looks for "memosprite", ignores HTML tags/punctuation, and captures the next Capitalized word(s)
      const summonMatch = mainKitDesc.match(/[Mm]emosprite\b[\s,:-]*(?:<[^>]+>[\s,:-]*)*([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)/);
      
      const ignoreWords = ['The', 'A', 'When', 'If', 'While', 'After', 'All', 'Any'];
      
      if (summonMatch && summonMatch[1] && !ignoreWords.includes(summonMatch[1].trim())) {
         memospriteName = summonMatch[1].trim();
      } else {
         // Strategy B: Smart-read the Memosprite's own Talent description!
         const msTalent = memospriteSkills.find((s: any) => s.type_text?.includes('Talent'));
         if (msTalent && msTalent.desc) {
            // Strip out starting conditional words (e.g. "When ", "If ", "While ") and HTML tags
            const cleanDesc = msTalent.desc.replace(/^(?:When|If|While|After|Upon|At|<[^>]+>|\s|,)+/i, '');
            // Capture the first capitalized word (or pair of words for names like "Little Ica")
            const nameMatch = cleanDesc.match(/^([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)/);
            if (nameMatch && nameMatch[1]) {
                memospriteName = nameMatch[1].trim();
            }
         }
      }

      character.servant = {
        name: memospriteName,
        icon: memospriteSkills[0]?.icon || character.icon,
        skills: memospriteSkills
      };
    }

    // 4. Attach Eidolons
    if (character.ranks) {
      character.eidolons = character.ranks.map((rankId: string) => ranksData[rankId])
    }

    if (promosData) {
      // Find the character's promotion data. We check the exact ID, and fallback to searching the array
      const charPromos = promosData[id] || Object.values(promosData).find((p: any) => p[0]?.id?.toString().startsWith(id))
      if (charPromos) {
        character.promotions = charPromos
      }
    }

    if (character.skill_trees) {
      const bonusAbilities: any[] = []
      const statTotals: Record<string, { value: number, isPercent: boolean, icon: string }> = {}

      const statTypeMap: Record<string, { name: string, isPercent: boolean }> = {
        'DefenseAddedRatio': { name: 'DEF', isPercent: true },
        'DefenceAddedRatio': { name: 'DEF', isPercent: true }, // Added alternate spelling
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
        'ElationDamageAddedRatioBase': { name: 'Elation DMG Boost', isPercent: true }, // Added Elation Element
        'BreakDamageAddedRatioBase': { name: 'Break Effect', isPercent: true },
        'HealRatioBase': { name: 'Outgoing Healing Boost', isPercent: true },
        'SPRatioBase': { name: 'Energy Regeneration Rate', isPercent: true },
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
            icon: node.icon,
            params: (node.params || node.levels?.[0]?.params || []).flat()
          })
        }

        if (hasStats) {
          node.levels[0].properties.forEach((prop: any) => {
            const propType = prop.type as string
            const statInfo = statTypeMap[propType] || { name: propType, isPercent: false }
            const statName = statInfo.name as string
            
            const officialIcon = propsData[propType]?.icon || ''
            
            if (!statTotals[statName]) {
              statTotals[statName] = { value: 0, isPercent: statInfo.isPercent, icon: officialIcon }
            }
            statTotals[statName].value += prop.value
          })
        }
      })

      character.stat_totals = Object.entries(statTotals).map(([key, stat]) => {
        const formatted = stat.isPercent ? `${+(stat.value * 100).toFixed(1)}%` : `${+stat.value.toFixed(1)}`
        return { name: key, value: formatted, icon: stat.icon }
      })

      character.bonus_abilities = bonusAbilities.slice(-3)
    }
    
    return character
  } else {
    throw createError({ statusCode: 404, statusMessage: 'Character not found' })
  }
})