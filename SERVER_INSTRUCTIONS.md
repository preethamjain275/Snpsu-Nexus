# 🚀 SNPSU Nexus Server Instructions

## Quick Start (Choose One Method)

### Method 1: Double-click to start
- **Windows**: Double-click `start-server.bat`
- **PowerShell**: Right-click `start-server.ps1` → "Run with PowerShell"

### Method 2: Command Line
```bash
# Navigate to project folder
cd "C:\Users\DELL\OneDrive\Desktop\Project final\Project final"

# Start server
node server.js
```

### Method 3: Using npm
```bash
npm start
```

## ✅ How to Know Server is Running

When the server starts successfully, you'll see:
```
Server running on http://localhost:3000
SNPSU Nexus Backend is ready!
```

## 🔧 Troubleshooting

### If you get "Cannot connect to server" error:

1. **Check if server is running:**
   - Look for the success message above
   - Open browser and go to `http://localhost:3000`

2. **Start the server:**
   - Double-click `start-server.bat` OR
   - Run `node server.js` in terminal

3. **Check port 3000 is free:**
   ```bash
   netstat -ano | findstr :3000
   ```

### If server won't start:

1. **Make sure you're in the right folder:**
   - Navigate to: `C:\Users\DELL\OneDrive\Desktop\Project final\Project final`

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Check Node.js is installed:**
   ```bash
   node --version
   ```

## 🛑 How to Stop Server

- Press `Ctrl + C` in the terminal where server is running
- Or close the terminal window

## 📁 Project Structure

```
Project final/
├── server.js          # Main server file
├── start-server.bat   # Windows batch file to start server
├── start-server.ps1   # PowerShell script to start server
├── package.json       # Dependencies
└── index.html         # Frontend
```

## 🔄 Auto-Restart for Development

For development with auto-restart:
```bash
npm run dev
```

This will automatically restart the server when you make changes to the code.

## 📞 Support

If you still have issues:
1. Make sure Node.js is installed
2. Make sure you're in the correct project directory
3. Try running `npm install` first
4. Check that port 3000 is not being used by another application
