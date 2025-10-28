const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Serve uploaded files directory (so frontend can preview/download via /uploads/<filename>)
app.use('/uploads', express.static(uploadsDir));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

// Initialize SQLite database
const db = new sqlite3.Database('academic_content.db');

// Create tables
db.serialize(() => {
    // Improve concurrency and reduce locking errors on Windows/OneDrive environments
    db.run('PRAGMA journal_mode = WAL;');
    db.run('PRAGMA busy_timeout = 5000;');
    db.run(`CREATE TABLE IF NOT EXISTS content (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        semester TEXT NOT NULL,
        subject TEXT NOT NULL,
        content_type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        file_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_size INTEGER,
        file_type TEXT,
        upload_date DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// API Routes

// Upload content
app.post('/api/upload', (req, res) => {
    // Use multer programmatically to capture errors and return JSON responses
    upload.single('file')(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            console.error('Multer error during upload:', err);
            // Return specific multer error messages to help debugging
            return res.status(400).json({ error: err.message });
        } else if (err) {
            console.error('Unknown error during upload:', err);
            return res.status(500).json({ error: 'Upload failed', details: err.message });
        }

        try {
            const { semester, subject, contentType, title, description } = req.body;
            const file = req.file;

            if (!file) {
                return res.status(400).json({ error: 'No file uploaded - ensure the form field name is "file" and FormData is used' });
            }

            console.log('Received upload:', { semester, subject, contentType, title, filename: file.originalname, size: file.size });

            const stmt = db.prepare(`
                INSERT INTO content (semester, subject, content_type, title, description, file_name, file_path, file_size, file_type)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            stmt.run([
                semester,
                subject,
                contentType,
                title,
                description || '',
                file.originalname,
                file.path,
                file.size,
                file.mimetype
            ], function(err) {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Database error', details: err.message });
                }

                // Confirm file exists on disk and log the inserted id
                const insertedId = this.lastID;
                const fileExists = fs.existsSync(file.path);
                console.log(`Inserted DB id=${insertedId}, fileExists=${fileExists}, filePath=${file.path}`);

                res.json({
                    success: true,
                    id: insertedId,
                    message: 'Content uploaded successfully',
                    filePath: file.path,
                    fileName: file.originalname,
                    fileExists: fileExists
                });
            });

            stmt.finalize();
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ error: 'Upload failed', details: error.message });
        }
    });
});

// Get all content
app.get('/api/content', (req, res) => {
    db.all('SELECT * FROM content ORDER BY upload_date DESC', (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});

// Get content by semester
app.get('/api/content/semester/:semester', (req, res) => {
    const semester = req.params.semester;
    db.all('SELECT * FROM content WHERE semester = ? ORDER BY upload_date DESC', [semester], (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});

// Get content by semester and subject
app.get('/api/content/semester/:semester/subject/:subject', (req, res) => {
    const { semester, subject } = req.params;
    db.all('SELECT * FROM content WHERE semester = ? AND subject = ? ORDER BY upload_date DESC', [semester, subject], (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});

// Download/Preview file
app.get('/api/file/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM content WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (!row) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Check if file_path is absolute or relative
        let filePath;
        if (path.isAbsolute(row.file_path)) {
            filePath = row.file_path;
        } else {
            filePath = path.join(__dirname, row.file_path);
        }
        
        console.log('Looking for file at:', filePath);
        
        if (!fs.existsSync(filePath)) {
            console.log('File not found at:', filePath);
            return res.status(404).json({ error: 'File not found on disk' });
        }

        res.download(filePath, row.file_name);
    });
});

// Delete content
app.delete('/api/content/:id', (req, res) => {
    const id = req.params.id;
    
    // First get file info to delete from disk
    db.get('SELECT * FROM content WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (!row) {
            return res.status(404).json({ error: 'Content not found' });
        }

        // Delete from database
        db.run('DELETE FROM content WHERE id = ?', [id], function(err) {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            // Delete file from disk
            let filePath;
            if (path.isAbsolute(row.file_path)) {
                filePath = row.file_path;
            } else {
                filePath = path.join(__dirname, row.file_path);
            }
            
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            res.json({ success: true, message: 'Content deleted successfully' });
        });
    });
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('SNPSU Nexus Backend is ready!');
});
