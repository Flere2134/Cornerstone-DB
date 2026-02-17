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

export const parseHoyoMarkup = (text: string): string => {
  if (!text) return ''

  let parsed = text

  // 1. Convert Hoyoverse color tags to actual CSS spans
  // Example: <color=#F84F36>Fire DMG</color>
  parsed = parsed.replace(
    /<color=#([a-zA-Z0-9]{6,8})>(.*?)<\/color>/g, 
    '<span style="color: #$1" class="font-bold drop-shadow-md">$2</span>'
  )

  // 2. Convert <unbreak> tags to Tailwind's whitespace-nowrap
  parsed = parsed.replace(
    /<unbreak>(.*?)<\/unbreak>/g, 
    '<span class="whitespace-nowrap">$1</span>'
  )

  // 3. Clean up the raw variable placeholders like #1[i] or #4[f1]
  // We will replace them with a stylized amber badge for now. 
  parsed = parsed.replace(
    /#\d+\[[a-zA-Z0-9]+\]/g, 
    '<span class="text-amber-400 font-bold bg-amber-400/10 px-1 rounded">[ X ]</span>'
  )

  return parsed
}