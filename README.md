# 🧪 Web Lab

A static hub page that links to multiple interactive mini-projects, deployed to GitHub Pages using GitHub Actions.

## 📁 Project Structure

```
repo-root/
├── lab/                          # Deployed folder (GitHub Pages serves this)
│   ├── index.html                # Main hub page
│   ├── assets/
│   │   └── css/
│   │       └── tailwind.css      # Generated Tailwind CSS (built by CI)
│   └── projects/
│       ├── clock/                # Digital clock project
│       │   ├── index.html
│       │   └── app.js
│       ├── calculator/           # Addition calculator
│       │   ├── index.html
│       │   └── app.js
│       ├── gallery/              # Image gallery with navigation
│       │   ├── index.html
│       │   └── app.js
│       ├── notes/                # Notes app with localStorage
│       │   ├── index.html
│       │   └── app.js
│       └── game/                 # Guess the number game
│           ├── index.html
│           └── app.js
├── src/
│   └── input.css                 # Tailwind CSS input file
├── .github/
│   └── workflows/
│       └── pages.yml             # GitHub Actions workflow
├── package.json
├── tailwind.config.js
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm (comes with Node.js)

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/username/repo-name.git
   cd repo-name
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start Tailwind in watch mode:**
   ```bash
   npm run dev
   ```

4. **Serve the `lab/` folder locally:**
   
   Use VS Code Live Server extension or any static server:
   ```bash
   # Using Python
   cd lab && python -m http.server 8080
   
   # Using Node.js serve package
   npx serve lab
   ```

5. **Open in browser:**
   - Navigate to `http://localhost:8080` (or your server's port)

### Build for Production

```bash
npm run build
```

This generates a minified `lab/assets/css/tailwind.css`.

## 🌐 GitHub Pages Deployment

The site is automatically deployed to GitHub Pages when you push to the `main` branch.

### Setup Instructions

1. Go to your repository **Settings**
2. Navigate to **Pages** (in the sidebar)
3. Under **Source**, select **GitHub Actions**
4. Push to `main` branch to trigger deployment

The deployed site will be available at:
```
https://username.github.io/repo-name/
```

## 📦 Included Projects

| Project | Description |
|---------|-------------|
| ⏰ **Clock** | A live digital clock that displays the current time and updates every second |
| 🧮 **Calculator** | A simple calculator that adds two numbers together |
| 🖼️ **Gallery** | An image gallery with next/previous navigation and captions |
| 📝 **Notes** | A notes app that saves text to localStorage for persistence |
| 🎮 **Game** | A "Guess the Number" game between 1 and 20 with feedback |

## 🛠️ Tech Stack

- **Tailwind CSS** - Utility-first CSS framework (compiled via CLI)
- **Vanilla JavaScript** - No frameworks, just plain JS
- **GitHub Actions** - CI/CD for building and deploying
- **GitHub Pages** - Static site hosting

## 📝 Notes

- The deployed site is served from the `lab/` folder only
- All paths are relative to work correctly under subpath hosting
- Tailwind CSS is built in CI before deployment
- The `tailwind.css` file should not be committed (it's generated)

## 📄 License

MIT License
