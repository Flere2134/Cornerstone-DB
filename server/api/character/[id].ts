// server/api/character/[id].ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') as string
  
  // Fetch Characters, Skills, AND Ranks simultaneously
  const [rawChars, rawSkills, rawRanks] = await Promise.all([
    $fetch<string>('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en/characters.json', { responseType: 'text' }),
    $fetch<string>('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en/character_skills.json', { responseType: 'text' }),
    $fetch<string>('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en/character_ranks.json', { responseType: 'text' })
  ])
  
  const chars = JSON.parse(rawChars)
  const skillsData = JSON.parse(rawSkills)
  const ranksData = JSON.parse(rawRanks)
  
  const character = chars[id]
  
  if (character) {
    // Attach Skills
    if (character.skills) {
      character.kit = character.skills.map((skillId: string) => skillsData[skillId])
    }
    
    // Attach Eidolons (Ranks)
    if (character.ranks) {
      character.eidolons = character.ranks.map((rankId: string) => ranksData[rankId])
    }
    
    return character
  } else {
    throw createError({ statusCode: 404, statusMessage: 'Character not found' })
  }
})