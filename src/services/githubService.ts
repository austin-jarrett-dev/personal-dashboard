export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  private: boolean
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
  open_issues_count: number
}

export interface GitHubPullRequest {
  id: number
  number: number
  title: string
  html_url: string
  state: 'open' | 'closed' | 'merged'
  created_at: string
  user: {
    login: string
    avatar_url: string
  }
}

export interface GitHubIssue {
  id: number
  number: number
  title: string
  html_url: string
  state: 'open' | 'closed'
  created_at: string
  user: {
    login: string
    avatar_url: string
  }
  labels: Array<{
    name: string
    color: string
  }>
}

export interface GitHubCommit {
  sha: string
  commit: {
    author: {
      name: string
      email: string
      date: string
    }
    message: string
  }
  author: {
    login: string
    avatar_url: string
  } | null
  html_url: string
}

export interface GitHubActivity {
  pullRequests: {
    open: number
    closed: number
    merged: number
    recent: GitHubPullRequest[]
  }
  issues: {
    open: number
    closed: number
    recent: GitHubIssue[]
  }
  commits: {
    total: number
    recent: GitHubCommit[]
    weeklyActivity: number[]
  }
}

export interface GitHubStats {
  totalRepos: number
  totalStars: number
  totalForks: number
  publicRepos: number
  privateRepos: number
}

export class GitHubService {
  private baseUrl = 'https://api.github.com'
  private token?: string

  constructor(token?: string) {
    this.token = token
  }

  private async fetch(endpoint: string) {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json'
    }

    if (this.token) {
      headers.Authorization = `token ${this.token}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, { headers })
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    return response.json()
  }

  async getUserRepos(username: string, limit: number = 10): Promise<GitHubRepo[]> {
    try {
      const repos = await this.fetch(`/users/${username}/repos?sort=updated&per_page=${limit}`)
      return repos
    } catch (error) {
      console.error('Error fetching GitHub repos:', error)
      return []
    }
  }

  async getRepoPullRequests(owner: string, repo: string, state: 'open' | 'closed' | 'all' = 'open'): Promise<GitHubPullRequest[]> {
    try {
      const prs = await this.fetch(`/repos/${owner}/${repo}/pulls?state=${state}&per_page=10`)
      return prs
    } catch (error) {
      console.error('Error fetching pull requests:', error)
      return []
    }
  }

  async getRepoIssues(owner: string, repo: string, state: 'open' | 'closed' | 'all' = 'open'): Promise<GitHubIssue[]> {
    try {
      const issues = await this.fetch(`/repos/${owner}/${repo}/issues?state=${state}&per_page=10`)
      return issues.filter((issue: any) => !issue.pull_request) // Filter out PRs
    } catch (error) {
      console.error('Error fetching issues:', error)
      return []
    }
  }

  async getUserStats(username: string): Promise<GitHubStats> {
    try {
      const user = await this.fetch(`/users/${username}`)
      const repos = await this.fetch(`/users/${username}/repos?per_page=100`)
      
      const stats = repos.reduce((acc: any, repo: GitHubRepo) => {
        acc.totalStars += repo.stargazers_count
        acc.totalForks += repo.forks_count
        if (repo.private) acc.privateRepos++
        else acc.publicRepos++
        return acc
      }, {
        totalRepos: repos.length,
        totalStars: 0,
        totalForks: 0,
        publicRepos: 0,
        privateRepos: 0
      })

      return stats
    } catch (error) {
      console.error('Error fetching GitHub stats:', error)
      return {
        totalRepos: 0,
        totalStars: 0,
        totalForks: 0,
        publicRepos: 0,
        privateRepos: 0
      }
    }
  }

  async getRepositoryActivity(owner: string, repo: string): Promise<GitHubActivity> {
    try {
      const [openPRs, closedPRs, openIssues, closedIssues, recentCommits, weeklyStats] = await Promise.all([
        this.getRepoPullRequests(owner, repo, 'open'),
        this.getRepoPullRequests(owner, repo, 'closed'),
        this.getRepoIssues(owner, repo, 'open'),
        this.getRepoIssues(owner, repo, 'closed'),
        this.getRepoCommits(owner, repo),
        this.getRepoWeeklyStats(owner, repo)
      ])

      return {
        pullRequests: {
          open: openPRs.length,
          closed: closedPRs.filter(pr => !pr.state.includes('merged')).length,
          merged: closedPRs.filter(pr => pr.state.includes('merged')).length,
          recent: [...openPRs.slice(0, 3), ...closedPRs.slice(0, 2)]
        },
        issues: {
          open: openIssues.length,
          closed: closedIssues.length,
          recent: [...openIssues.slice(0, 3), ...closedIssues.slice(0, 2)]
        },
        commits: {
          total: recentCommits.length,
          recent: recentCommits.slice(0, 5),
          weeklyActivity: weeklyStats
        }
      }
    } catch (error) {
      console.error('Error fetching repository activity:', error)
      return {
        pullRequests: { open: 0, closed: 0, merged: 0, recent: [] },
        issues: { open: 0, closed: 0, recent: [] },
        commits: { total: 0, recent: [], weeklyActivity: [] }
      }
    }
  }

  async getRepoCommits(owner: string, repo: string, limit: number = 20): Promise<GitHubCommit[]> {
    try {
      const commits = await this.fetch(`/repos/${owner}/${repo}/commits?per_page=${limit}`)
      return commits
    } catch (error) {
      console.error('Error fetching commits:', error)
      return []
    }
  }

  async getRepoWeeklyStats(owner: string, repo: string): Promise<number[]> {
    try {
      const stats = await this.fetch(`/repos/${owner}/${repo}/stats/commit_activity`)
      if (!stats || !Array.isArray(stats)) return []
      
      // Return last 4 weeks of commit activity
      return stats.slice(-4).map((week: any) => week.total || 0)
    } catch (error) {
      console.error('Error fetching weekly stats:', error)
      return []
    }
  }

  async getRepoContributors(owner: string, repo: string): Promise<any[]> {
    try {
      const contributors = await this.fetch(`/repos/${owner}/${repo}/contributors?per_page=10`)
      return contributors || []
    } catch (error) {
      console.error('Error fetching contributors:', error)
      return []
    }
  }
}