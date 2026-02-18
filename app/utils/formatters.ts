const pathMap: Record<string, string> = {
  Knight: 'Preservation',
  Warrior: 'Destruction',
  Rogue: 'Hunt',
  Mage: 'Erudition',
  Shaman: 'Harmony',
  Warlock: 'Nihility',
  Priest: 'Abundance',
  Unknown: 'Unknown' // For Trailblazer or special cases
}

export const getOfficialPath = (internalPath: string): string => {
  return pathMap[internalPath] || internalPath
}

// app/utils/formatters.ts

// ... (keep your existing pathMap and getOfficialPath function up here) ...

// utils/formatters.ts
export const parseHoyoMarkup = (text: string, params: number[] = []) => {
  if (!text) return ''
  let result = text

  // 1. If we have params, inject the real numbers!
  if (params && params.length > 0) {
    // This regex looks for tags like #1[i] or #2[f1] and checks if a % sign follows them
    result = result.replace(/#(\d+)\[.*?\](%?)/g, (match, indexStr, percentSign) => {
      const index = parseInt(indexStr) - 1
      let value = params[index]

      if (value === undefined) return `<span class="text-amber-400 font-bold">[ X ]${percentSign}</span>`

      // If Hoyo placed a % sign after the tag, we need to multiply the raw decimal by 100
      if (percentSign) {
        value = value * 100
        // Round to 1 decimal place to fix ugly floating-point math (e.g. 28.0000001 -> 28)
        value = Math.round(value * 10) / 10
      }

      return `<span class="text-amber-400 font-bold">${value}${percentSign}</span>`
    })
  }

  // 2. Fallback: If no params were provided, revert to the [ X ] placeholder
  result = result.replace(/#\d+\[.*?\](%?)/g, (match, percentSign) => `<span class="text-amber-400 font-bold">[ X ]${percentSign}</span>`)
  
  // 3. Clean up Hoyoverse's internal HTML tags
  result = result.replace(/<unbreak>/g, '').replace(/<\/unbreak>/g, '')
  result = result.replace(/<color=(.*?)>(.*?)<\/color>/g, '<span style="color: $1">$2</span>')
  result = result.replace(/\\n/g, '<br>')

  return result
}

export const getCharacterName = (name: string): string => {
  return name === '{NICKNAME}' ? 'Trailblazer' : name
}