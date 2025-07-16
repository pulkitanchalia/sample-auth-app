# 🚫 Git Ignore Configuration

## 📁 Files and Folders Excluded from Git

The `.gitignore` file has been configured to exclude the following:

### 🐍 **Python Related**
- `.venv/`, `venv/`, `env/` - Virtual environments
- `__pycache__/`, `*.pyc` - Python cache files
- `*.egg-info/`, `dist/`, `build/` - Package build artifacts
- `.env`, `.env.local` - Environment files with secrets

### 🗄️ **Database Files**
- `*.db`, `*.sqlite`, `*.sqlite3` - SQLite database files
- `test.db` - Development database

### 📦 **Node.js / Angular Related**
- `node_modules/` - NPM dependencies
- `/dist/`, `/tmp/`, `/out-tsc/` - Angular build outputs
- `npm-debug.log*` - NPM debug logs
- `.npm`, `.eslintcache` - NPM and linting cache

### 📝 **IDE and Editor Files**
- `.vscode/`, `.idea/` - Editor configurations
- `*.swp`, `*.swo` - Vim swap files
- `.history/` - VS Code local history

### 💻 **Operating System Files**
- `.DS_Store` (macOS)
- `Thumbs.db`, `ehthumbs.db` (Windows)
- `*.lnk` - Windows shortcuts

### 📊 **Testing and Coverage**
- `coverage/` - Test coverage reports
- `.nyc_output` - Test coverage cache

### 🔧 **Build and Cache Files**
- `*.log` - Log files
- `.cache/`, `.parcel-cache` - Build caches
- `*.tsbuildinfo` - TypeScript build info

## ✅ **Benefits**

1. **Smaller repository size** - No unnecessary files
2. **Security** - Environment files with secrets excluded
3. **Clean commits** - Only source code tracked
4. **No conflicts** - Generated files don't cause merge issues
5. **Cross-platform** - Works on Windows, macOS, Linux

## 🔄 **Usage**

The `.gitignore` is automatically applied when you:
- `git add .` - Excluded files won't be added
- `git status` - Excluded files won't show as untracked
- Share repository - Others won't get your local files

Perfect for keeping your auth app repository clean! 🎉
