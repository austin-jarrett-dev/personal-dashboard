import { useState } from 'react'
import { useTheme } from '../hooks/useTheme'

const ThemeSelector = () => {
  const { currentTheme, changeTheme, themes } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-4 py-2 rounded-lg ${currentTheme.cardBackground} ${currentTheme.border} ${currentTheme.text} ${currentTheme.cardHover} transition-all duration-200 flex items-center gap-2`}
      >
        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
        <span>{currentTheme.name}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className={`absolute top-full mt-2 right-0 min-w-48 ${currentTheme.cardBackground} ${currentTheme.border} rounded-lg shadow-xl z-50 ${currentTheme.blur ? 'backdrop-blur-xl' : ''}`}>
          <div className="p-2 space-y-1">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  changeTheme(theme.id)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                  currentTheme.id === theme.id 
                    ? `${theme.accent} bg-white/10` 
                    : `${theme.text} hover:bg-white/5`
                }`}
              >
                <div 
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{
                    background: theme.gradient 
                      ? `linear-gradient(135deg, ${getGradientColors(theme.background)})` 
                      : theme.cardBackground.includes('bg-') 
                        ? getBackgroundColor(theme.cardBackground)
                        : '#4a5568'
                  }}
                ></div>
                <span className="text-sm">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const getGradientColors = (background: string): string => {
  if (background.includes('blue')) return '#1e3a8a, #0f172a'
  if (background.includes('purple')) return '#581c87, #be185d'
  if (background.includes('teal')) return '#134e4a, #164e63'
  if (background.includes('green')) return '#14532d, #134e4a'
  if (background.includes('orange')) return '#9a3412, #be123c'
  if (background.includes('indigo')) return '#3730a3, #1e1b4b'
  return '#374151, #111827'
}

const getBackgroundColor = (bgClass: string): string => {
  if (bgClass.includes('black')) return '#000000'
  if (bgClass.includes('gray-900')) return '#111827'
  if (bgClass.includes('gray-800')) return '#1f2937'
  if (bgClass.includes('white')) return '#ffffff'
  return '#374151'
}

export default ThemeSelector