import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from '../hooks/useTheme'
import { GitHubService, GitHubRepo, GitHubActivity } from '../services/githubService'

interface RepoDetailModalProps {
  repo: GitHubRepo
  isOpen: boolean
  onClose: () => void
  githubService: GitHubService
}

const RepoDetailModal = ({ repo, isOpen, onClose, githubService }: RepoDetailModalProps) => {
  const { currentTheme } = useTheme()
  const [activity, setActivity] = useState<GitHubActivity | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'prs' | 'issues' | 'commits'>('overview')

  useEffect(() => {
    if (isOpen && repo) {
      loadActivity()
    }
  }, [isOpen, repo])

  const loadActivity = async () => {
    setLoading(true)
    try {
      const [owner, repoName] = repo.full_name.split('/')
      const activityData = await githubService.getRepositoryActivity(owner, repoName)
      setActivity(activityData)
    } catch (error) {
      console.error('Error loading repository activity:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStateColor = (state: string) => {
    switch (state) {
      case 'open': return 'text-green-400'
      case 'closed': return 'text-red-400'
      case 'merged': return 'text-purple-400'
      default: return currentTheme.textMuted
    }
  }

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'open': return '🟢'
      case 'closed': return '🔴'
      case 'merged': return '🟣'
      default: return '⚪'
    }
  }

  if (!isOpen) return null

  const modalContent = (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4" style={{ zIndex: 99999 }}>
      <div 
        className="max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] rounded-xl bg-gray-900/95 border border-gray-700 shadow-2xl overflow-hidden"
        style={{
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          backgroundColor: 'rgba(17, 24, 39, 0.95)'
        }}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-700 flex items-center justify-between bg-gray-800/50">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`text-xl sm:text-2xl ${repo.private ? 'text-orange-400' : 'text-green-400'}`}>
              {repo.private ? '🔒' : '📁'}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-bold text-white truncate">
                {repo.name}
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm">
                {repo.description || 'No description'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-600 transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-4 sm:p-6 pb-0 bg-gray-800/30 overflow-x-auto">
          {(['overview', 'prs', 'issues', 'commits'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors capitalize whitespace-nowrap ${
                activeTab === tab
                  ? 'text-blue-400 bg-blue-500/20'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              {tab === 'prs' ? 'PRs' : tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-180px)] sm:max-h-[calc(90vh-200px)] bg-gray-900/50">
          {loading ? (
            <div className="text-center py-8 text-gray-400">
              Loading repository activity...
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && activity && (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 rounded-lg bg-gray-800/60 border border-gray-600/50">
                      <div className="text-2xl font-bold text-blue-400">
                        {repo.stargazers_count}
                      </div>
                      <div className="text-xs text-gray-300">Stars</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-gray-800/60 border border-gray-600/50">
                      <div className="text-2xl font-bold text-blue-400">
                        {repo.forks_count}
                      </div>
                      <div className="text-xs text-gray-300">Forks</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-gray-800/60 border border-gray-600/50">
                      <div className="text-2xl font-bold text-blue-400">
                        {activity.pullRequests.open}
                      </div>
                      <div className="text-xs text-gray-300">Open PRs</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-gray-800/60 border border-gray-600/50">
                      <div className="text-2xl font-bold text-blue-400">
                        {activity.issues.open}
                      </div>
                      <div className="text-xs text-gray-300">Open Issues</div>
                    </div>
                  </div>

                  {/* Recent Activity Summary */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className={`font-semibold ${currentTheme.text} mb-3`}>Recent Pull Requests</h3>
                      <div className="space-y-2">
                        {activity.pullRequests.recent.slice(0, 3).map((pr) => (
                          <div key={pr.id} className="flex items-center gap-3 p-2 rounded bg-black/10">
                            <span className={getStateColor(pr.state)}>{getStateIcon(pr.state)}</span>
                            <div className="flex-1 min-w-0">
                              <div className={`text-sm ${currentTheme.text} truncate`}>{pr.title}</div>
                              <div className={`text-xs ${currentTheme.textMuted}`}>
                                #{pr.number} • {formatDate(pr.created_at)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className={`font-semibold ${currentTheme.text} mb-3`}>Recent Issues</h3>
                      <div className="space-y-2">
                        {activity.issues.recent.slice(0, 3).map((issue) => (
                          <div key={issue.id} className="flex items-center gap-3 p-2 rounded bg-black/10">
                            <span className={getStateColor(issue.state)}>{getStateIcon(issue.state)}</span>
                            <div className="flex-1 min-w-0">
                              <div className={`text-sm ${currentTheme.text} truncate`}>{issue.title}</div>
                              <div className={`text-xs ${currentTheme.textMuted}`}>
                                #{issue.number} • {formatDate(issue.created_at)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pull Requests Tab */}
              {activeTab === 'prs' && activity && (
                <div className="space-y-4">
                  <div className="flex gap-4 text-sm">
                    <span className={currentTheme.text}>
                      🟢 {activity.pullRequests.open} Open
                    </span>
                    <span className={currentTheme.text}>
                      🟣 {activity.pullRequests.merged} Merged
                    </span>
                    <span className={currentTheme.text}>
                      🔴 {activity.pullRequests.closed} Closed
                    </span>
                  </div>
                  <div className="space-y-3">
                    {activity.pullRequests.recent.map((pr) => (
                      <div key={pr.id} className="p-4 rounded-lg bg-black/20 border border-white/5">
                        <div className="flex items-start gap-3">
                          <span className={`text-lg ${getStateColor(pr.state)}`}>
                            {getStateIcon(pr.state)}
                          </span>
                          <div className="flex-1">
                            <div className={`font-medium ${currentTheme.text} mb-1`}>
                              {pr.title}
                            </div>
                            <div className={`text-sm ${currentTheme.textMuted}`}>
                              #{pr.number} opened {formatDate(pr.created_at)} by {pr.user.login}
                            </div>
                          </div>
                          <a
                            href={pr.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm ${currentTheme.accent} hover:underline`}
                          >
                            View →
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Issues Tab */}
              {activeTab === 'issues' && activity && (
                <div className="space-y-4">
                  <div className="flex gap-4 text-sm">
                    <span className={currentTheme.text}>
                      🟢 {activity.issues.open} Open
                    </span>
                    <span className={currentTheme.text}>
                      🔴 {activity.issues.closed} Closed
                    </span>
                  </div>
                  <div className="space-y-3">
                    {activity.issues.recent.map((issue) => (
                      <div key={issue.id} className="p-4 rounded-lg bg-black/20 border border-white/5">
                        <div className="flex items-start gap-3">
                          <span className={`text-lg ${getStateColor(issue.state)}`}>
                            {getStateIcon(issue.state)}
                          </span>
                          <div className="flex-1">
                            <div className={`font-medium ${currentTheme.text} mb-1`}>
                              {issue.title}
                            </div>
                            <div className={`text-sm ${currentTheme.textMuted} mb-2`}>
                              #{issue.number} opened {formatDate(issue.created_at)} by {issue.user.login}
                            </div>
                            {issue.labels.length > 0 && (
                              <div className="flex gap-1 flex-wrap">
                                {issue.labels.slice(0, 3).map((label) => (
                                  <span
                                    key={label.name}
                                    className="px-2 py-1 text-xs rounded"
                                    style={{ backgroundColor: `#${label.color}20`, color: `#${label.color}` }}
                                  >
                                    {label.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <a
                            href={issue.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm ${currentTheme.accent} hover:underline`}
                          >
                            View →
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Commits Tab */}
              {activeTab === 'commits' && activity && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {activity.commits.recent.map((commit) => (
                      <div key={commit.sha} className="p-4 rounded-lg bg-black/20 border border-white/5">
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full ${currentTheme.accent} mt-2 flex-shrink-0`}></div>
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium ${currentTheme.text} mb-1`}>
                              {commit.commit.message.split('\n')[0]}
                            </div>
                            <div className={`text-sm ${currentTheme.textMuted}`}>
                              {commit.author?.login || commit.commit.author.name} • {formatDate(commit.commit.author.date)} • 
                              <span className="font-mono ml-1">{commit.sha.substring(0, 7)}</span>
                            </div>
                          </div>
                          <a
                            href={commit.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm ${currentTheme.accent} hover:underline`}
                          >
                            View →
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default RepoDetailModal