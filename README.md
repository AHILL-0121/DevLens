# DevLens - AI GitHub Profile Analyzer

![DevLens](https://img.shields.io/badge/DevLens-AI%20Profile%20Analyzer-blue)
![Next.js](https://img.shields.io/badge/Next.js-13+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3+-06B6D4)

Transform your GitHub activity into career insights with AI-powered analysis. Get ATS-ready resume bullets, role matching analysis, and personalized growth recommendations.

## ✨ Features

- **🔍 Deep GitHub Analysis**: Comprehensive analysis of repositories, languages, and contribution patterns
- **🤖 AI-Powered Insights**: Personalized resume bullets and career recommendations  
- **🎯 Role Matching**: Match against SDE, AI/ML, and Cybersecurity career paths
- **� ATS Scoring Engine**: Complete ATS compatibility analysis with actionable recommendations
- **📈 Skill Radar Charts**: Interactive visualization of your skill distribution across roles
- **📋 ATS-Ready Content**: Generate resume bullets and LinkedIn headlines
- **📄 PDF Resume Generation**: Download professional PDF resumes with AI insights
- **🔐 User Authentication**: Secure GitHub OAuth integration for premium features
- **💾 Report Management**: Save, share, and manage analysis reports
- **🗺️ Growth Roadmap**: Get personalized skill development recommendations
- **🎨 Glassmorphism UI**: Modern, beautiful interface with smooth animations
- **⚡ Skeleton Loading**: Smooth loading states for better UX
- **📱 Responsive Design**: Works perfectly on all devices
- **📊 Analytics Dashboard**: Track your progress and analysis history

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- GitHub Personal Access Token (optional, for higher rate limits)

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your configuration:
   ```env
   # Required: GitHub token for API access
   GITHUB_TOKEN=your_github_token_here
   
   # Required: NextAuth configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_here
   
   # Required: GitHub OAuth App credentials
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   
   # Database (SQLite for development)
   DATABASE_URL="file:./dev.db"
   
   # Optional: HuggingFace token for advanced AI features  
   HUGGINGFACE_API_KEY=your_huggingface_token_here
   ```

4. **Set up the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

```
DevLens/
├── app/                    # Next.js App Router
│   ├── api/                # API endpoints
│   │   ├── analyze/        # GitHub analysis endpoint
│   │   ├── auth/           # NextAuth authentication
│   │   └── reports/        # Report management API
│   ├── page.tsx            # Main application page
│   ├── layout.tsx          # Root layout with glassmorphism background
│   ├── providers.tsx       # Session provider setup
│   └── globals.css         # Global styles and animations
├── components/             # Reusable UI components
│   ├── GlassComponents.tsx      # Glassmorphism UI primitives
│   ├── SkeletonLoaders.tsx      # Loading state components  
│   ├── ProfileDisplay.tsx       # User profile display
│   ├── TechStackDisplay.tsx     # Languages and tech stack
│   ├── RoleMatching.tsx         # Career role analysis
│   ├── AIInsightsDisplay.tsx    # AI-generated insights
│   ├── ATSScoringDisplay.tsx    # ATS compatibility scoring
│   └── SkillRadarChart.tsx      # Interactive skill radar
├── lib/                    # Core business logic
│   ├── github.ts           # GitHub API integration
│   ├── analyzer.ts         # Repository analysis engine
│   ├── roleMatcher.ts      # Career role matching logic
│   ├── ai.ts               # AI insights generation
│   ├── atsScoring.ts       # ATS compatibility engine
│   ├── pdfGenerator.ts     # PDF resume generation
│   └── prisma.ts           # Database client setup
├── types/                  # TypeScript type definitions
│   └── profile.ts          # Data models
├── utils/                  # Utility functions
│   └── scoring.ts          # Engagement scoring algorithms
├── prisma/                 # Database schema and migrations
│   └── schema.prisma       # Database schema definition
└── [config files]         # Next.js, Tailwind, TypeScript configs
```

## 🔧 Configuration

### GitHub Token Setup (Recommended)

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Generate a new token (classic) with `public_repo` scope
3. Add it to your `.env.local` file as `GITHUB_TOKEN`

**Benefits:**
- Higher rate limits (5000 requests/hour vs 60)
- Access to private repository data (if needed)
- More reliable performance

### GitHub OAuth Setup (Required for Authentication)

1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Create a new OAuth App with:
   - Application name: `DevLens Local`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
3. Copy the Client ID and Client Secret to your `.env.local` file
4. Generate a random string for `NEXTAUTH_SECRET` (can use `openssl rand -base64 32`)

### Database Setup

The application uses SQLite for development (no additional setup required) and supports PostgreSQL for production:

```bash
# Initialize database
npx prisma generate
npx prisma db push

# View database (optional)
npx prisma studio
```

### HuggingFace Integration (Optional)

For advanced AI features:
1. Sign up at [HuggingFace](https://huggingface.co)
2. Get your API key from [Settings > Access Tokens](https://huggingface.co/settings/tokens)
3. Add it to `.env.local` as `HUGGINGFACE_API_KEY`

## 🎨 Design System

### Color Palette
- **Primary**: Teal gradient (`#14b8a6` to `#0d9488`)
- **Accent**: Blue gradient (`#0ea5e9` to `#0284c7`)  
- **Background**: Dark slate to blue gradient
- **Glass**: White/10% opacity with backdrop blur

### Component Library
- `GlassCard`: Glassmorphism container with blur effects
- `GlassButton`: Interactive button with hover animations
- `GlassInput`: Input field with focus states
- `GlassProgressBar`: Animated progress indicators

## 📊 Analysis Features

### Profile Analysis
- Repository count and star metrics
- Language distribution and usage patterns
- Recent activity and engagement scores
- Tech stack detection from repo topics/descriptions

### Role Matching Algorithm
- **SDE**: JavaScript, React, Node.js, databases, cloud platforms
- **AI/ML**: Python, TensorFlow, PyTorch, data science libraries
- **Cybersecurity**: Security tools, networking, penetration testing

### AI Insights Generation
- ATS-optimized resume bullet points
- LinkedIn headline suggestions
- Skills section for resumes
- Personalized growth roadmap
- Career path recommendations

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Import project in Vercel dashboard
   - Add environment variables
   - Deploy automatically

3. **Add Environment Variables:**
   - `GITHUB_TOKEN`: Your GitHub personal access token
   - `HUGGINGFACE_API_KEY`: Your HuggingFace API key (optional)

### Other Platforms
- **Netlify**: Works with minor configuration
- **Railway**: Full-stack deployment support  
- **Digital Ocean**: App platform compatible

## 🔍 API Reference

### POST /api/analyze

Analyze a GitHub profile and generate insights.

**Request:**
```json
{
  "username": "octocat",
  "saveReport": true
}
```

**Response:**
```json
{
  "user": { /* GitHub user data */ },
  "analysis": { /* Repository analysis */ },
  "roles": { /* Role matching results */ },
  "insights": { /* AI-generated insights */ },
  "atsScore": { /* ATS compatibility score */ },
  "generatedAt": "2024-01-01T00:00:00.000Z",
  "isPremium": true
}
```

### GET /api/reports

Get saved analysis reports (authenticated users only).

**Response:**
```json
[
  {
    "id": "report_id",
    "githubUsername": "octocat",
    "atsScore": 85,
    "atsGrade": "A",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST /api/reports

Save an analysis report (authenticated users only).

**Request:**
```json
{
  "reportData": { /* Full DevLens report */ },
  "githubUsername": "octocat",
  "atsScore": 85,
  "atsGrade": "A",
  "isPublic": false
}
```

**Error Responses:**
- `400`: Invalid username or request format
- `401`: Unauthorized (authentication required)
- `404`: GitHub user not found
- `429`: Rate limit exceeded
- `500`: Internal server error

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/devlens/issues)
- **Documentation**: [Project Wiki](https://github.com/yourusername/devlens/wiki)
- **Developer**: [GitHub - AHILL-0121](https://github.com/AHILL-0121)
- **Portfolio**: [https://sa-portfolio-psi.vercel.app/](https://sa-portfolio-psi.vercel.app/)

## 🔮 Roadmap

### Phase 2 Features
- [ ] PDF resume generation
- [ ] Skill radar charts and visualizations  
- [ ] Full ATS scoring engine
- [ ] User authentication and saved reports
- [ ] Database integration for analytics
- [ ] Advanced AI models (GPT-4, Claude)
- [ ] GitHub contribution graph analysis
- [ ] Portfolio website generation
- [ ] Team/organization analysis
- [ ] Career progression tracking

### SaaS Features (Phase 3)
- [ ] Premium subscription tiers
- [ ] White-label solutions
- [ ] API access for third parties
- [ ] Integration with job boards
- [ ] HR dashboard for recruiters
- [ ] Bulk analysis tools

## ⭐ Show Your Support

If you find DevLens helpful, please consider:
- ⭐ Starring this repository
- 🐛 Reporting bugs and issues  
- 💡 Suggesting new features
- 🤝 Contributing code or documentation
- 📢 Sharing with your network

---

## 👨‍💻 Developer

**Built with ❤️ by [AHILL-0121](https://github.com/AHILL-0121)**

🌐 [Portfolio](https://sa-portfolio-psi.vercel.app/) | 💼 [GitHub](https://github.com/AHILL-0121)

*DevLens - Transforming GitHub profiles into career insights for the developer community*