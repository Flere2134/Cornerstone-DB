// server/api/lightcones.ts
export default defineEventHandler(async () => {
  // Fetch the master dictionary of all Lightcones
  const rawData = await $fetch<string>('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en/light_cones.json', {
    responseType: 'text'
  })
  
  const dict = JSON.parse(rawData)
  
  // Convert the dictionary into an array and return it
  return Object.values(dict)
})