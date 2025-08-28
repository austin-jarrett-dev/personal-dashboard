import WidgetCard from '../components/WidgetCard'
import GitWidget from '../components/GitWidget'
import ThemeSelector from '../components/ThemeSelector'
import { useTheme } from '../hooks/useTheme'

const Dashboard = () => {
  const { currentTheme } = useTheme()
  
  return (
    <div className="container mx-auto px-6 py-8">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className={`text-4xl font-bold ${currentTheme.text} mb-2`}>
            Personal Dashboard
          </h1>
          <p className={currentTheme.textMuted}>
            Your personalized workspace and development tools
          </p>
        </div>
        <ThemeSelector />
      </header>

      <main className="dashboard-grid">
        <GitWidget 
          username="austin-jarrett-dev"
          repositories={['.', '../other-project']}
        />
        
        <WidgetCard 
          title="Welcome"
          content="This is your personal dashboard. Add widgets and tools to customize your workspace."
        />
        
        <WidgetCard 
          title="Quick Stats"
          content="Track your daily metrics and progress here."
        />
        
        <WidgetCard 
          title="Development Tools"
          content="Access your frequently used development utilities."
        />
        
        <WidgetCard 
          title="Notes"
          content="Keep track of important notes and reminders."
        />
      </main>
    </div>
  )
}

export default Dashboard