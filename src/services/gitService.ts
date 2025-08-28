export interface GitStatus {
  branch: string
  ahead: number
  behind: number
  staged: number
  unstaged: number
  untracked: number
  clean: boolean
}

export interface GitCommit {
  hash: string
  message: string
  author: string
  date: string
}

export interface RepoInfo {
  name: string
  path: string
  status: GitStatus
  recentCommits: GitCommit[]
  remoteUrl?: string
  isGitRepo: boolean
}

// Since we can't execute git commands directly from the browser,
// this service will need to be extended with an API backend
// For now, we'll provide mock data structure and interface

export class GitService {
  async getRepoInfo(path: string = '.'): Promise<RepoInfo> {
    // In a real implementation, this would call a backend API
    // that executes git commands on the server
    return {
      name: 'personal-dashboard',
      path,
      status: {
        branch: 'main',
        ahead: 0,
        behind: 0,
        staged: 0,
        unstaged: 0,
        untracked: 0,
        clean: true
      },
      recentCommits: [
        {
          hash: '1d7ba0a',
          message: 'Add React dashboard with 10 theme system and floating glass cards',
          author: 'User',
          date: new Date().toISOString()
        }
      ],
      remoteUrl: 'https://github.com/user/personal-dashboard.git',
      isGitRepo: true
    }
  }

  async getMultipleRepos(paths: string[]): Promise<RepoInfo[]> {
    return Promise.all(paths.map(path => this.getRepoInfo(path)))
  }
}