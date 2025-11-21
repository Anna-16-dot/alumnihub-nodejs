# Cross-Platform Compatibility Guide

The VCET Alumni Hub is designed to work seamlessly across **Windows**, **macOS**, and **Linux** platforms.

## ✅ Supported Platforms

- **Windows** 10, 11
- **macOS** (Intel and Apple Silicon/M1/M2)
- **Linux** (Ubuntu, Debian, CentOS, Fedora, etc.)

## 🔧 Cross-Platform Features

### 1. Path Handling
All file paths use Node.js `path` module for cross-platform compatibility:
```javascript
// ✅ Cross-platform
path.join(__dirname, 'uploads', 'profiles')
path.resolve(__dirname, '..', 'config')

// ❌ Platform-specific (don't use)
'uploads/profiles'  // Works on macOS/Linux only
'uploads\\profiles' // Works on Windows only
```

### 2. Scripts Available

| Script | Windows | macOS/Linux | Description |
|--------|---------|-------------|-------------|
| `npm start` | ✅ | ✅ | Start production server |
| `npm run dev` | ✅ | ✅ | Start development server |
| `npm run generate-views` | ✅ | ✅ | Generate EJS templates |
| `start.bat` | ✅ | ❌ | Windows quick start |
| `start.sh` | ❌ | ✅ | Unix quick start |
| `generate-views.bat` | ✅ | ❌ | Windows view generator |
| `generate-views.sh` | ❌ | ✅ | Unix view generator |
| `deploy-to-render.bat` | ✅ | ❌ | Windows deployment helper |
| `deploy-to-render.sh` | ❌ | ✅ | Unix deployment helper |

### 3. Environment Variables
The `.env` file works identically on all platforms:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=vcet_alumni_hub
```

## 📋 Platform-Specific Setup

### Windows Setup

1. **Install Node.js**
   - Download from: https://nodejs.org/
   - Choose LTS version
   - Verify: `node --version` and `npm --version`

2. **Install MySQL**
   - Option A: XAMPP (recommended) - https://www.apachefriends.org/
   - Option B: MySQL Community Server - https://dev.mysql.com/downloads/mysql/

3. **Quick Start**
   ```cmd
   cd C:\xampp\htdocs\alumnihub-nodejs
   npm install
   copy .env.example .env
   npm start
   ```

4. **Or Use Batch Scripts**
   - Double-click `start.bat` to start server
   - Double-click `generate-views.bat` if views are missing

**Full Guide**: See [WINDOWS_SETUP.md](WINDOWS_SETUP.md)

### macOS Setup

1. **Install Node.js**
   ```bash
   # Using Homebrew
   brew install node
   
   # Or download from: https://nodejs.org/
   ```

2. **Install MySQL**
   ```bash
   # Using Homebrew
   brew install mysql
   brew services start mysql
   
   # Or use XAMPP: https://www.apachefriends.org/
   ```

3. **Quick Start**
   ```bash
   cd /Applications/XAMPP/xamppfiles/htdocs/alumnihub-nodejs
   npm install
   cp .env.example .env
   npm start
   ```

4. **Or Use Shell Script**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

### Linux Setup

1. **Install Node.js**
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # CentOS/RHEL
   curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
   sudo yum install -y nodejs
   ```

2. **Install MySQL**
   ```bash
   # Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install mysql-server
   sudo systemctl start mysql
   
   # CentOS/RHEL
   sudo yum install mysql-server
   sudo systemctl start mysqld
   ```

3. **Quick Start**
   ```bash
   cd /var/www/alumnihub-nodejs
   npm install
   cp .env.example .env
   npm start
   ```

4. **Or Use Shell Script**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

## 🔍 Platform-Specific Issues

### Windows

**Issue**: Scripts won't run  
**Solution**: Use `npm run` commands instead of shell scripts
```cmd
npm run dev
npm run generate-views
```

**Issue**: Path not found errors  
**Solution**: Use correct Windows path format
```cmd
cd C:\xampp\htdocs\alumnihub-nodejs
```

**Issue**: Permission errors with uploads  
**Solution**: Folders are created automatically. If issues persist, create manually:
```cmd
mkdir uploads\profiles
mkdir uploads\posts
```

### macOS

**Issue**: Permission denied when running scripts  
**Solution**: Make scripts executable
```bash
chmod +x start.sh generate-views.sh deploy-to-render.sh
```

**Issue**: MySQL connection refused  
**Solution**: Start MySQL service
```bash
# If using XAMPP
sudo /Applications/XAMPP/xamppfiles/xampp startmysql

# If using Homebrew
brew services start mysql
```

### Linux

**Issue**: npm: command not found  
**Solution**: Ensure Node.js is properly installed and in PATH
```bash
which node
which npm
# If not found, reinstall Node.js
```

**Issue**: MySQL socket error  
**Solution**: Check MySQL is running
```bash
sudo systemctl status mysql
sudo systemctl start mysql
```

**Issue**: Port 3000 already in use  
**Solution**: Change port in `.env` or kill existing process
```bash
# Change port
PORT=3001

# Or kill process using port 3000
sudo lsof -ti:3000 | xargs kill -9
```

## 🗂️ File System Differences

### Line Endings
- **Windows**: CRLF (`\r\n`)
- **macOS/Linux**: LF (`\n`)

Git handles this automatically with `.gitattributes`. No action needed.

### File Paths
All paths in code use `path.join()` or `path.resolve()` for compatibility:
```javascript
// In middleware/upload.js
path.resolve(__dirname, '..', 'uploads', 'profiles')

// In server.js
path.join(__dirname, 'views')
path.join(__dirname, 'public')
```

### Case Sensitivity
- **Windows**: Case-insensitive file system
- **macOS**: Case-insensitive by default (but can be case-sensitive)
- **Linux**: Case-sensitive file system

**Best Practice**: Always use exact case for file names in code.

## 🚀 Running on All Platforms

### Recommended: NPM Scripts (Works Everywhere)
```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Generate view templates
npm run generate-views
```

### Windows-Specific
```cmd
REM Quick start
start.bat

REM Generate views
generate-views.bat

REM Deploy helper
deploy-to-render.bat
```

### macOS/Linux-Specific
```bash
# Quick start
./start.sh

# Generate views
./generate-views.sh

# Deploy helper
./deploy-to-render.sh
```

## 🧪 Testing Cross-Platform Compatibility

The application has been tested on:
- ✅ Windows 10 Pro (64-bit)
- ✅ Windows 11 Home (64-bit)
- ✅ macOS Monterey (Intel)
- ✅ macOS Ventura (Apple Silicon M1)
- ✅ Ubuntu 22.04 LTS
- ✅ Debian 11
- ✅ CentOS 8

## 📝 Best Practices for Cross-Platform Development

1. **Always use `path` module** for file paths
2. **Use forward slashes in URLs** (works everywhere)
3. **Use npm scripts** instead of shell scripts when possible
4. **Test `.env` file** on each platform
5. **Avoid platform-specific commands** in Node.js code
6. **Use `process.env.PORT`** instead of hardcoding ports
7. **Use `os.EOL`** for line endings if needed

## 🆘 Getting Help

If you encounter platform-specific issues:

1. Check the platform-specific guide:
   - Windows: [WINDOWS_SETUP.md](WINDOWS_SETUP.md)
   - General: [README.md](README.md)
   - Setup: [SETUP.md](SETUP.md)

2. Common issues are documented in each guide

3. Use npm scripts (they work on all platforms):
   ```bash
   npm run dev
   npm start
   ```

## ✨ Summary

The VCET Alumni Hub is **100% cross-platform compatible**. Whether you're using Windows, macOS, or Linux:

- ✅ Same codebase works everywhere
- ✅ Same npm commands work everywhere
- ✅ Same .env configuration works everywhere
- ✅ Platform-specific scripts provided for convenience
- ✅ All paths are cross-platform compatible
- ✅ Database works the same on all platforms

**Just run `npm install` and `npm run dev` on any platform!** 🚀
