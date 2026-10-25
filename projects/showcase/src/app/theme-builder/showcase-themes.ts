/** daisyUI's built-in themes in the same order as its theme picker. */
export const daisyThemes = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
  'dim',
  'nord',
  'sunset',
  'caramellatte',
  'abyss',
  'silk',
] as const;

export type DaisyThemeName = (typeof daisyThemes)[number];

export function displayThemeName(name: string): string {
  return name.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}
