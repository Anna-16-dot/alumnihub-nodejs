# Windows Setup Guide

This guide will help you set up the VCET Alumni Hub application on Windows.

## Prerequisites

### 1. Install Node.js
- Download from: https://nodejs.org/
- Choose LTS version (v16 or higher)
- During installation, ensure "Add to PATH" is checked
- Verify installation:
  ```cmd
  node --version
  npm --version
  ```

### 2. Install MySQL
- Download XAMPP from: https://www.apachefriends.org/
- Or download MySQL Community Server from: https://dev.mysql.com/downloads/mysql/
- Start MySQL service from XAMPP Control Panel or Services

### 3. Install Git (Optional, for deployment)
- Download from: https://git-scm.com/download/win
- Use default installation settings

## Quick Start

### 1. Install Dependencies
Open Command Prompt or PowerShell in the project directory:
```cmd
npm install
```

### 2. Configure Environment Variables
Copy the `.env.example` to `.env` (or create `.env` manually):
```cmd
copy .env.example .env
```

Edit `.env` with your settings:
```env
NODE_ENV=development
PORT=3000
HOST=localhost

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=vcet_alumni_hub
DB_PORT=3306
DB_CONNECTION_LIMIT=10

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
SESSION_MAX_AGE=86400000

# App Configuration
APP_NAME=VCET Alumni Hub
BASE_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880
```

### 3. Create Database
Open MySQL command line or phpMyAdmin and run:
```sql
CREATE DATABASE vcet_alumni_hub;
USE vcet_alumni_hub;
```

Then import the database schema:
```cmd
mysql -u root -p vcet_alumni_hub < database-export.sql
```

Or use phpMyAdmin to import `database-export.sql`

### 4. Generate View Templates (if needed)
```cmd
npm run generate-views
```

Or double-click `generate-views.bat`

### 5. Start the Server
```cmd
npm start
```

For development with auto-reload:
```cmd
npm run dev
```

### 6. Access the Application
Open your browser and go to:
```
http://localhost:3000
```

## Windows-Specific Notes

### Path Handling
- The application now uses cross-platform path handling with `path.join()` and `path.resolve()`
- File uploads work correctly on Windows

### Scripts
- **Batch Scripts**: `generate-views.bat` and `deploy-to-render.bat` are Windows equivalents of shell scripts
- **NPM Scripts**: All npm scripts work cross-platform

### File Permissions
- No special file permissions needed on Windows
- Upload directories are created automatically

### MySQL on Windows
If using XAMPP:
1. Start XAMPP Control Panel
2. Click "Start" for Apache and MySQL
3. Use default credentials (usually `root` with no password)

### Troubleshooting

#### Port Already in Use
If port 3000 is busy, change PORT in `.env`:
```env
PORT=3001
```

#### MySQL Connection Error
- Verify MySQL is running (XAMPP Control Panel)
- Check DB_HOST, DB_USER, DB_PASSWORD in `.env`
- Ensure database `vcet_alumni_hub` exists

#### Module Not Found
```cmd
npm install
```

#### Permission Issues with Uploads
- Ensure the `uploads/profiles` and `uploads/posts` directories exist
- They are created automatically by the application

## Development Tools

### Recommended VS Code Extensions
- ESLint
- Prettier
- EJS Language Support
- MySQL (by Jun Han)

### Running in VS Code
1. Open project folder in VS Code
2. Open Terminal (Ctrl + `)
3. Run: `npm start` or `npm run dev`

## Building for Production

### Environment Setup
Update `.env` for production:
```env
NODE_ENV=production
SESSION_SECRET=generate-a-strong-random-secret
```

### Using PM2 (Process Manager)
```cmd
npm install -g pm2
pm2 start server.js --name "alumni-hub"
pm2 startup
pm2 save
```

## Deployment

### Option 1: Deploy to Render
1. Run: `deploy-to-render.bat`
2. Follow the instructions
3. See `RENDER_DEPLOYMENT.md` for detailed steps

### Option 2: Deploy to Heroku
1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Follow Heroku Node.js deployment guide

### Option 3: Windows Server / IIS
1. Install IISNode: https://github.com/azure/iisnode
2. Configure IIS to serve Node.js application
3. Use PM2 for process management

## Common Commands

```cmd
# Install dependencies
npm install

# Start server
npm start

# Development mode (auto-reload)
npm run dev

# Generate views
npm run generate-views

# Check Node.js version
node --version

# Check installed packages
npm list --depth=0
```

## Support

For issues or questions:
- Check `README.md` for general documentation
- Review `SETUP.md` for detailed setup instructions
- See `TROUBLESHOOTING.md` for common issues

## Cross-Platform Compatibility

This application is now fully compatible with:
- ✅ Windows 10/11
- ✅ macOS
- ✅ Linux

All scripts and paths have been made cross-platform compatible.
