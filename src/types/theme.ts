export interface Theme {
  id: string
  name: string
  background: string
  cardBackground: string
  cardHover: string
  accent: string
  text: string
  textMuted: string
  border: string
  gradient?: string
  blur?: boolean
}

export const themes: Theme[] = [
  {
    id: 'midnight',
    name: 'Midnight Blue',
    background: 'from-slate-950 via-blue-950 to-slate-900',
    cardBackground: 'bg-slate-900/60 backdrop-blur-sm',
    cardHover: 'hover:bg-slate-800/70',
    accent: 'text-blue-400',
    text: 'text-slate-100',
    textMuted: 'text-slate-400',
    border: 'border-slate-700/50',
    gradient: true,
    blur: true
  },
  {
    id: 'glass',
    name: 'Frosted Glass',
    background: 'from-gray-900 via-gray-800 to-slate-900',
    cardBackground: 'bg-white/5 backdrop-blur-xl',
    cardHover: 'hover:bg-white/10',
    accent: 'text-cyan-300',
    text: 'text-white',
    textMuted: 'text-gray-300',
    border: 'border-white/20',
    gradient: true,
    blur: true
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    background: 'bg-black',
    cardBackground: 'bg-gray-900',
    cardHover: 'hover:bg-gray-800',
    accent: 'text-purple-400',
    text: 'text-gray-100',
    textMuted: 'text-gray-500',
    border: 'border-gray-800',
    gradient: false,
    blur: false
  },
  {
    id: 'aurora',
    name: 'Aurora',
    background: 'from-indigo-950 via-purple-900 to-pink-900',
    cardBackground: 'bg-black/30 backdrop-blur-md',
    cardHover: 'hover:bg-black/40',
    accent: 'text-pink-300',
    text: 'text-purple-100',
    textMuted: 'text-purple-300',
    border: 'border-purple-500/30',
    gradient: true,
    blur: true
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    background: 'from-blue-950 via-teal-900 to-cyan-950',
    cardBackground: 'bg-teal-950/40 backdrop-blur-sm',
    cardHover: 'hover:bg-teal-900/50',
    accent: 'text-teal-300',
    text: 'text-cyan-50',
    textMuted: 'text-cyan-300',
    border: 'border-teal-600/40',
    gradient: true,
    blur: true
  },
  {
    id: 'forest',
    name: 'Forest Night',
    background: 'from-green-950 via-emerald-900 to-teal-950',
    cardBackground: 'bg-emerald-900/30 backdrop-blur-md',
    cardHover: 'hover:bg-emerald-800/40',
    accent: 'text-emerald-300',
    text: 'text-green-50',
    textMuted: 'text-green-300',
    border: 'border-emerald-600/30',
    gradient: true,
    blur: true
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    background: 'from-orange-950 via-red-900 to-pink-950',
    cardBackground: 'bg-orange-900/25 backdrop-blur-lg',
    cardHover: 'hover:bg-orange-800/35',
    accent: 'text-orange-300',
    text: 'text-orange-50',
    textMuted: 'text-orange-200',
    border: 'border-orange-600/40',
    gradient: true,
    blur: true
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    background: 'bg-gray-950',
    cardBackground: 'bg-gray-800',
    cardHover: 'hover:bg-gray-700',
    accent: 'text-white',
    text: 'text-gray-100',
    textMuted: 'text-gray-400',
    border: 'border-gray-600',
    gradient: false,
    blur: false
  },
  {
    id: 'neon',
    name: 'Neon Cyber',
    background: 'bg-black',
    cardBackground: 'bg-gray-900 border border-cyan-500/20',
    cardHover: 'hover:bg-gray-800 hover:border-cyan-400/40',
    accent: 'text-cyan-400',
    text: 'text-green-400',
    textMuted: 'text-green-300',
    border: 'border-cyan-500/30',
    gradient: false,
    blur: false
  },
  {
    id: 'pearl',
    name: 'Pearl Mist',
    background: 'from-gray-100 via-blue-50 to-indigo-100',
    cardBackground: 'bg-white/70 backdrop-blur-sm',
    cardHover: 'hover:bg-white/90',
    accent: 'text-indigo-600',
    text: 'text-gray-800',
    textMuted: 'text-gray-600',
    border: 'border-gray-200/60',
    gradient: true,
    blur: true
  }
]