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
}