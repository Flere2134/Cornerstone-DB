// server/api/characters.ts
export default defineEventHandler(async () => {
  // Fetch the master dictionary of all characters
  const rawChars = await $fetch<string>('https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_new/en/characters.json', {
    responseType: 'text'
  })
  const charsDict = JSON.parse(rawChars)

  // JSON files often store lists as dictionaries (e.g., {"1304": {...}, "1308": {...}}).
  // Object.values() converts that dictionary into a simple array so we can easily loop through it!
  return Object.values(charsDict)
})