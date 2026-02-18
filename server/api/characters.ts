// server/api/characters.ts
export default defineEventHandler(async () => {
  const rawData = await $fetch<string>('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en/characters.json', {
    responseType: 'text'
  })
  
  const dict = JSON.parse(rawData)
  
  return Object.values(dict).sort((a: any, b: any) => {
    // Trailblazer variants use IDs 8000 and above
    const isTrailblazerA = Number(a.id) >= 8000
    const isTrailblazerB = Number(b.id) >= 8000
    
    // If one is a Trailblazer and the other isn't, push the Trailblazer down
    if (isTrailblazerA && !isTrailblazerB) return 1
    if (!isTrailblazerA && isTrailblazerB) return -1
    
    // Otherwise, sort normally from newest (highest ID) to oldest
    return Number(b.id) - Number(a.id)
  })
})