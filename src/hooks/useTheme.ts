import { useState, useEffect } from 'react'
import { Theme, themes } from '../types/theme'

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0])

  const changeTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId)
    if (theme) {
      setCurrentTheme(theme)
      localStorage.setItem('dashboard-theme', themeId)
    }
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('dashboard-theme')
    if (savedTheme) {
      const theme = themes.find(t => t.id === savedTheme)
      if (theme) {
        setCurrentTheme(theme)
      }
    }
  }, [])

  return {
    currentTheme,
    changeTheme,
    themes
  }
}