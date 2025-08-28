import { useState, useEffect } from 'react'
import { useTheme } from '../hooks/useTheme'
import { GitService, RepoInfo } from '../services/gitService'
import { GitHubService, GitHubRepo, GitHubStats } from '../services/githubService'
import RepoDetailModal from './RepoDetailModal'

interface GitWidgetProps {
  username?: string
  githubToken?: string
  repositories?: string[]
}

const GitWidget = ({ username, githubToken, repositories = ['.'] }: GitWidgetProps) => {
  const { currentTheme } = useTheme()
  const [localRepos, setLocalRepos] = useState<RepoInfo[]>([])
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([])
  const [githubStats, setGithubStats] = useState<GitHubStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'local' | 'github'>('local')
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const gitService = new GitService()
  const githubService = new GitHubService(githubToken)

  useEffect(() => {
    loadData()
  }, [username, githubToken])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load local repo data
      const localData = await gitService.getMultipleRepos(repositories)
      setLocalRepos(localData)

      // Load GitHub data if username provided
      if (username) {
        const [repos, stats] = await Promise.all([
          githubService.getUserRepos(username, 5),
          githubService.getUserStats(username)
        ])
        setGithubRepos(repos)
        setGithubStats(stats)
      }
    } catch (error) {
      console.error('Error loading Git data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: RepoInfo['status']) => {
    if (!status.clean) return 'text-yellow-400'
    if (status.ahead > 0) return 'text-blue-400'
    if (status.behind > 0) return 'text-orange-400'
    return 'text-green-400'
  }

  const getStatusIcon = (status: RepoInfo['status']) => {
    if (!status.clean) return '⚡'
    if (status.ahead > 0) return '↑'
    if (status.behind > 0) return '↓'
    return '✓'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const handleRepoClick = (repo: GitHubRepo) => {
    setSelectedRepo(repo)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedRepo(null)
  }

  if (loading) {
    return (
      <div className={`rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 shadow-2xl backdrop-blur-xl border border-white/10 bg-white/5`}
           style={{
             boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), 0 0 0 1px rgba(255, 255, 255, 0.05)',
             backdropFilter: 'blur(20px)',
             WebkitBackdropFilter: 'blur(20px)'
           }}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`${currentTheme.accent} text-xl`}>📊</div>
          <h3 className={`text-xl font-semibold ${currentTheme.text}`}>Git Status</h3>
        </div>
        <div className={`${currentTheme.textMuted} text-center py-8`}>
          Loading repository data...
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 shadow-2xl backdrop-blur-xl border border-white/10 bg-white/5`}
         style={{
           boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), 0 0 0 1px rgba(255, 255, 255, 0.05)',
           backdropFilter: 'blur(20px)',
           WebkitBackdropFilter: 'blur(20px)'
         }}>
      
      {/* Header with tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`${currentTheme.accent} text-xl`}>📊</div>
          <h3 className={`text-xl font-semibold ${currentTheme.text}`}>Git Status</h3>
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('local')}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              activeTab === 'local'
                ? `${currentTheme.accent} bg-white/10`
                : `${currentTheme.textMuted} hover:bg-white/5`
            }`}
          >
            Local
          </button>
          {username && (
            <button
              onClick={() => setActiveTab('github')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                activeTab === 'github'
                  ? `${currentTheme.accent} bg-white/10`
                  : `${currentTheme.textMuted} hover:bg-white/5`
              }`}
            >
              GitHub
            </button>
          )}
        </div>
      </div>

      {/* Local Repos Tab */}
      {activeTab === 'local' && (
        <div className="space-y-3">
          {localRepos.map((repo, index) => (
            <div key={index} className="p-3 rounded-lg bg-black/20 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`text-lg ${getStatusColor(repo.status)}`}>
                    {getStatusIcon(repo.status)}
                  </span>
                  <div>
                    <div className={`font-medium ${currentTheme.text}`}>
                      {repo.name}
                    </div>
                    <div className={`text-xs ${currentTheme.textMuted}`}>
                      {repo.status.branch}
                      {repo.status.ahead > 0 && ` • ${repo.status.ahead} ahead`}
                      {repo.status.behind > 0 && ` • ${repo.status.behind} behind`}
                    </div>
                  </div>
                </div>
                <div className={`text-xs ${currentTheme.textMuted}`}>
                  {repo.recentCommits[0]?.hash.substring(0, 7)}
                </div>
              </div>
              {repo.recentCommits[0] && (
                <div className={`text-xs ${currentTheme.textMuted} pl-8 border-l-2 border-white/10 space-y-1`}>
                  <div>{repo.recentCommits[0].message}</div>
                  <div className={`text-xs opacity-75`}>
                    {repo.recentCommits[0].author} • {formatDate(repo.recentCommits[0].date)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* GitHub Tab */}
      {activeTab === 'github' && username && (
        <div className="space-y-4">
          {/* GitHub Stats */}
          {githubStats && (
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 rounded-lg bg-black/20 border border-white/5">
                <div className={`text-lg font-bold ${currentTheme.accent}`}>
                  {githubStats.totalRepos}
                </div>
                <div className={`text-xs ${currentTheme.textMuted}`}>Repos</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-black/20 border border-white/5">
                <div className={`text-lg font-bold ${currentTheme.accent}`}>
                  {githubStats.totalStars}
                </div>
                <div className={`text-xs ${currentTheme.textMuted}`}>Stars</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-black/20 border border-white/5">
                <div className={`text-lg font-bold ${currentTheme.accent}`}>
                  {githubStats.totalForks}
                </div>
                <div className={`text-xs ${currentTheme.textMuted}`}>Forks</div>
              </div>
            </div>
          )}

          {/* Recent Repos */}
          <div className="space-y-2">
            {githubRepos.slice(0, 3).map((repo) => (
              <div 
                key={repo.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5 hover:bg-black/30 cursor-pointer transition-colors"
                onClick={() => handleRepoClick(repo)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`text-sm ${repo.private ? 'text-orange-400' : 'text-green-400'}`}>
                    {repo.private ? '🔒' : '📁'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium ${currentTheme.text} truncate`}>
                      {repo.name}
                    </div>
                    <div className={`text-xs ${currentTheme.textMuted} flex items-center gap-2`}>
                      {repo.language && <span>{repo.language}</span>}
                      <span>⭐ {repo.stargazers_count}</span>
                      <span>Updated {formatDate(repo.updated_at)}</span>
                    </div>
                  </div>
                </div>
                <div className={`text-xs ${currentTheme.textMuted}`}>
                  Click for details →
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refresh button */}
      <button
        onClick={loadData}
        className={`mt-4 w-full py-2 rounded-lg ${currentTheme.cardHover} ${currentTheme.textMuted} hover:${currentTheme.text} transition-colors text-sm`}
      >
        Refresh
      </button>

      {/* Repository Detail Modal */}
      {selectedRepo && (
        <RepoDetailModal
          repo={selectedRepo}
          isOpen={isModalOpen}
          onClose={closeModal}
          githubService={githubService}
        />
      )}
    </div>
  )
}

export default GitWidget