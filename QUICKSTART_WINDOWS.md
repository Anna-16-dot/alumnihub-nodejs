# Quick Start Guide - Windows Users

## 🚀 5-Minute Setup for Windows

### Prerequisites
1. **Node.js** (16+) - [Download](https://nodejs.org/)
2. **MySQL** via XAMPP - [Download](https://www.apachefriends.org/)

### Installation Steps

#### 1. Start XAMPP
- Open XAMPP Control Panel
- Click **Start** for Apache and MySQL modules

#### 2. Open Command Prompt
```cmd
cd C:\xampp\htdocs\alumnihub-nodejs
```

#### 3. Install Dependencies
```cmd
npm install
```

#### 4. Setup Environment
```cmd
copy .env.example .env
notepad .env
```

Edit these values:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=vcet_alumni_hub
```

#### 5. Import Database
- Open browser: `http://localhost/phpmyadmin`
- Create database: `vcet_alumni_hub`
- Click **Import** tab
- Choose file: `database-export.sql`
- Click **Go**

#### 6. Start Server
```cmd
npm run dev
```

#### 7. Open Application
```
http://localhost:3000
```

### Login Credentials
```
Email: admin@vcet.edu
Password: password
```

## 🎯 Alternative: One-Click Start

1. Double-click `start.bat` file
2. Follow prompts
3. Done!

## ❓ Having Issues?

See [WINDOWS_SETUP.md](WINDOWS_SETUP.md) for detailed troubleshooting.

## 📋 Quick Commands

```cmd
REM Start development server
npm run dev

REM Start production server
npm start

REM Generate view templates
npm run generate-views

REM Stop server
Ctrl + C
```

## ✅ You're All Set!

Visit `http://localhost:3000` and start exploring! 🎉
