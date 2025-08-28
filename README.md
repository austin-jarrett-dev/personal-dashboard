# Personal Dashboard

A sleek, customizable personal dashboard with advanced GitHub integration and beautiful glass-effect widgets. Built with React, TypeScript, and Vite.

## ✨ Features

### 🎨 **10 Beautiful Themes**
- **Midnight Blue** - Deep blue gradient with glass effects
- **Frosted Glass** - Translucent with advanced blur effects  
- **Obsidian** - Pure black minimalist design
- **Aurora** - Purple-pink gradient with cosmic vibes
- **Deep Ocean** - Blue-teal aquatic theme
- **Forest Night** - Green nature-inspired gradients
- **Sunset Glow** - Warm orange-red gradients
- **Monochrome** - Clean grayscale aesthetic
- **Neon Cyber** - Black with neon cyan accents
- **Pearl Mist** - Light theme with soft gradients

### 📊 **Advanced GitHub Integration**
- **Repository Overview** - Live stats, stars, forks, language info
- **Pull Request Tracking** - View open, closed, and merged PRs
- **Issue Management** - Track open and closed issues with labels
- **Commit History** - Recent commits with author and timestamps
- **Interactive Details** - Click any repo for comprehensive insights

### 🎭 **Premium UI Components**
- **Floating Glass Cards** - Beautiful glass-effect widgets with hover animations
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Theme Persistence** - Remembers your preferred theme
- **Smooth Animations** - Polished transitions and interactions

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/austin-jarrett-dev/personal-dashboard.git
   cd personal-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

To use GitHub integration features:

1. **Update your GitHub username** in `src/pages/Dashboard.tsx`:
   ```tsx
   <GitWidget username="your-github-username" />
   ```

2. **Optional: Add GitHub Token** for higher API rate limits:
   ```tsx
   <GitWidget 
     username="your-github-username"
     githubToken="your-github-token" 
   />
   ```

### Usage

#### Development
Start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

#### Build
Create a production build:
```bash
npm run build
```

#### Preview
Preview the production build locally:
```bash
npm run preview
```

#### Linting
Check for code style issues:
```bash
npm run lint
```

#### Type Checking
Run TypeScript type checking:
```bash
npm run typecheck
```

## 🚀 Usage Guide

### Theme Switching
- Click the **theme dropdown** in the top-right corner
- Choose from 10 professionally designed themes
- Your selection is automatically saved

### GitHub Widget
1. **Switch to GitHub tab** to see your repository stats
2. **Click any repository** to view detailed insights:
   - Pull request activity and status
   - Issue tracking with labels
   - Recent commit history
   - Repository statistics

### Adding More Widgets
The dashboard uses a flexible grid system. Add new widgets to `src/pages/Dashboard.tsx`:

```tsx
<WidgetCard 
  title="Your Widget"
  content="Widget description"
  icon={<YourIcon />}
  onClick={() => handleClick()}
/>
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── GitWidget.tsx    # Main GitHub integration widget
│   ├── RepoDetailModal.tsx # Repository detail modal
│   ├── ThemeSelector.tsx    # Theme switching dropdown
│   └── WidgetCard.tsx   # Base widget component
├── hooks/              # Custom React hooks
│   └── useTheme.ts     # Theme management hook
├── pages/              # Page components
│   └── Dashboard.tsx   # Main dashboard page
├── services/           # External API services
│   ├── githubService.ts # GitHub API integration
│   └── gitService.ts   # Local git operations
├── types/              # TypeScript type definitions
│   └── theme.ts        # Theme system types
└── utils/              # Utility functions
```

## 🔧 Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development  
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **GitHub API** - Real-time repository data

## 🎯 Roadmap

- [ ] Clock & Weather widget
- [ ] Quick notes with persistence  
- [ ] System information widget
- [ ] Drag & drop widget arrangement
- [ ] Custom widget creation
- [ ] Terminal integration
