import WidgetCard from '../components/WidgetCard'
import GitWidget from '../components/GitWidget'
import ThemeSelector from '../components/ThemeSelector'
import { useTheme } from '../hooks/useTheme'

const Dashboard = () => {
  const { currentTheme } = useTheme()
  
  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className={`text-3xl sm:text-4xl font-bold ${currentTheme.text} mb-2`}>
            Personal Dashboard
          </h1>
          <p className={`${currentTheme.textMuted} text-sm sm:text-base`}>
            Your personalized workspace and development tools
          </p>
        </div>
        <div className="self-end sm:self-start">
          <ThemeSelector />
        </div>
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