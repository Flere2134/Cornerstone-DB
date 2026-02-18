// server/api/relics.ts
export default defineEventHandler(async () => {
  const rawData = await $fetch<string>('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en/relic_sets.json', {
    responseType: 'text'
  })
  
  const dict = JSON.parse(rawData)
  
  // Convert to array and sort by ID descending (Newest relics first!)
  return Object.values(dict).sort((a: any, b: any) => Number(b.id) - Number(a.id))
})