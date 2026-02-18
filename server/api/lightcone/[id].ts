// server/api/lightcone/[id].ts
export default defineEventHandler(async (event) => {
  // 1. Added 'as string' to fix the TypeScript red line
  const id = getRouterParam(event, 'id') as string
  
  // 2. Fetch basic Lightcone data (Artwork, Rarity, Lore)
  const rawData = await $fetch<string>('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en/light_cones.json', {
    responseType: 'text'
  })
  const dict = JSON.parse(rawData)
  
  // 3. Fetch Lightcone Ranks (The actual passive abilities / Superimpositions)
  const rawRanks = await $fetch<string>('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en/light_cone_ranks.json', {
    responseType: 'text'
  })
  const ranksDict = JSON.parse(rawRanks)

  const lightcone = dict[id]
  
  if (lightcone) {
    // 4. Find Rank 1 (Superimposition 1) 
    // In StarRailRes, Rank 1 IDs are usually the Lightcone ID + "1" (e.g. 21000 -> 210001)
    const rank1Id = `${id}1`
    const rank1 = ranksDict[rank1Id] || Object.values(ranksDict).find((r: any) => r.id?.toString().startsWith(id))
    
    // 5. Attach it to the object so the frontend template can render it
    if (rank1) {
      lightcone.skill = {
        name: rank1.name || rank1.skill || 'Lightcone Ability',
        desc: rank1.desc
      }
    }
    
    return lightcone
  } else {
    throw createError({ statusCode: 404, statusMessage: 'Lightcone not found' })
  }
})