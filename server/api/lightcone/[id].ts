// server/api/lightcone/[id].ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') as string
  
  // 1. Fetch the main data, ranks, and now the promotions!
  const [rawData, rawRanks, rawPromotions] = await Promise.all([
    $fetch<string>('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en/light_cones.json', { responseType: 'text' }),
    $fetch<string>('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en/light_cone_ranks.json', { responseType: 'text' }),
    $fetch<string>('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en/light_cone_promotions.json', { responseType: 'text' })
  ])
  
  const dict = JSON.parse(rawData)
  const ranksDict = JSON.parse(rawRanks)
  const promosDict = JSON.parse(rawPromotions) // Parsed the scaling database

  const lightcone = dict[id]
  
  if (lightcone) {
    // Attach Superimposition Ranks
    const rankData = ranksDict[id] || Object.values(ranksDict).find((r: any) => r.id?.toString() === id)
    if (rankData) {
      lightcone.skill = {
        name: rankData.name || rankData.skill || 'Lightcone Ability',
        desc: rankData.desc,
        params: rankData.params
      }
    }
    
    // 2. Attach Ascension Scaling Promotions
    if (promosDict) {
      const lcPromos = promosDict[id] || Object.values(promosDict).find((p: any) => p[0]?.id?.toString().startsWith(id))
      if (lcPromos) {
        lightcone.promotions = lcPromos
      }
    }
    
    return lightcone
  } else {
    throw createError({ statusCode: 404, statusMessage: 'Lightcone not found' })
  }
})