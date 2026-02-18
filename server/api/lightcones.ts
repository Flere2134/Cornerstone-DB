// server/api/lightcones.ts
export default defineEventHandler(async () => {
  const rawData = await $fetch<string>('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en/light_cones.json', {
    responseType: 'text'
  })
  
  const dict = JSON.parse(rawData)
  
  return Object.values(dict).sort((a: any, b: any) => {
    // Herta Shop Lightcones use the 24000 ID block
    const isHertaA = Number(a.id) >= 24000 && Number(a.id) < 25000
    const isHertaB = Number(b.id) >= 24000 && Number(b.id) < 25000
    
    // Push Herta LCs to the bottom
    if (isHertaA && !isHertaB) return 1
    if (!isHertaA && isHertaB) return -1
    
    // Otherwise, sort normally from newest (highest ID) to oldest
    return Number(b.id) - Number(a.id)
  })
})