import { useTheme } from '../hooks/useTheme'

interface WidgetCardProps {
  title: string
  content: string
  icon?: React.ReactNode
  onClick?: () => void
}

const WidgetCard = ({ title, content, icon, onClick }: WidgetCardProps) => {
  const { currentTheme } = useTheme()
  
  return (
    <div 
      className={`rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 ${
        currentTheme.cardBackground
      } ${currentTheme.border} ${currentTheme.cardHover} ${
        onClick ? 'cursor-pointer' : ''
      } shadow-2xl backdrop-blur-xl border border-white/10 bg-white/5`}
      style={{
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-3">
        {icon && (
          <div className={`${currentTheme.accent} text-xl`}>
            {icon}
          </div>
        )}
        <h3 className={`text-xl font-semibold ${currentTheme.text}`}>
          {title}
        </h3>
      </div>
      <p className={currentTheme.textMuted}>
        {content}
      </p>
    </div>
  )
}

export default WidgetCard