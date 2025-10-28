# 🚀 QUICK START - SNPSU Nexus

## ⚡ Start Server (Choose One)

### Option 1: Double-click (Easiest)
- Double-click `start-server.bat`
- Wait for "Server running on http://localhost:3000"

### Option 2: Command Line
```bash
node server.js
```

### Option 3: Using npm
```bash
npm start
```

## ✅ Success Indicators

When server starts correctly, you'll see:
```
Server running on http://localhost:3000
SNPSU Nexus Backend is ready!
```

## 🔧 If You Get "Cannot connect to server" Error

1. **Check if server is running:**
   - Look for the success message above
   - Open `http://localhost:3000` in browser

2. **Start the server:**
   - Double-click `start-server.bat` OR
   - Run `node server.js`

3. **The frontend will now show:**
   - 🟢 Server Connected (if working)
   - 🔴 Server Disconnected (if not working)
   - Helpful alert message if server is down

## 🛑 Stop Server
- Press `Ctrl + C` in the terminal

## 📁 Files Created for You
- `start-server.bat` - Double-click to start server
- `start-server.ps1` - PowerShell script
- `SERVER_INSTRUCTIONS.md` - Detailed instructions
- `QUICK_START.md` - This file

## 🎯 You're All Set!
Your application now has:
- ✅ Auto-retry connection logic
- ✅ Visual server status indicator
- ✅ Helpful error messages
- ✅ Easy startup scripts
- ✅ Comprehensive documentation

**No more "Cannot connect to server" errors!** 🎉
