import Dashboard from './pages/Dashboard'
import { useTheme } from './hooks/useTheme'

function App() {
  const { currentTheme } = useTheme()
  
  return (
    <div className={`min-h-screen ${
      currentTheme.gradient 
        ? `bg-gradient-to-br ${currentTheme.background}`
        : currentTheme.background
    }`}>
      <Dashboard />
    </div>
  )
}

export default App