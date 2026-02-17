// server/api/character/[id].ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  // 1. Fetch basic character data
  const rawChars = await $fetch<string>('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en/characters.json', {
    responseType: 'text'
  })
  const chars = JSON.parse(rawChars)
  
  // 2. Fetch the massive skills dictionary
  const rawSkills = await $fetch<string>('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en/character_skills.json', {
    responseType: 'text'
  })
  const skillsData = JSON.parse(rawSkills)
  
  const character = chars[id]
  
  if (character) {
    // 3. Attach the specific skills (kit) to this character
    if (character.skills) {
      character.kit = character.skills.map((skillId: string) => skillsData[skillId])
    } else {
      // Fallback in case the skills array is missing from the base JSON
      character.kit = Object.values(skillsData).filter((skill: any) => skill.id.toString().startsWith(id))
    }
    
    return character
  } else {
    throw createError({ statusCode: 404, statusMessage: 'Character not found' })
  }
})