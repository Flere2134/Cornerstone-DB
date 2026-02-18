// server/api/lightcone/[id].ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') as string
  
  const rawData = await $fetch<string>('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en/light_cones.json', { responseType: 'text' })
  const dict = JSON.parse(rawData)
  
  const rawRanks = await $fetch<string>('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en/light_cone_ranks.json', { responseType: 'text' })
  const ranksDict = JSON.parse(rawRanks)

  const lightcone = dict[id]
  
  if (lightcone) {
    // Hoyoverse now uses the base Lightcone ID for the ranks!
    const rankData = ranksDict[id] || Object.values(ranksDict).find((r: any) => r.id?.toString() === id)
    
    if (rankData) {
      lightcone.skill = {
        name: rankData.name || rankData.skill || 'Lightcone Ability',
        desc: rankData.desc,
        params: rankData.params // This contains all 5 levels of stats!
      }
    }
    
    return lightcone
  } else {
    throw createError({ statusCode: 404, statusMessage: 'Lightcone not found' })
  }
})