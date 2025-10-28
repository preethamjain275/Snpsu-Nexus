// Global Variables
let isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
let currentSemester = null;
let contentData = {};

// API Base URL - Auto-detect based on environment
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3000/api' 
    : '/api';

// Server connection helper with auto-retry
async function checkServerConnection() {
    try {
        const response = await fetch(`${API_BASE}/content`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.ok;
    } catch (error) {
        console.log('Server connection failed:', error.message);
        return false;
    }
}

// Server connection functions removed - no more server status messages

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
    
    // Load content immediately without server connection checks
    loadContentFromBackend();
});

// Subject data for each semester
const semesterSubjects = {
    1: [
        { code: 'LAC', name: ' Linear Algebra and calculus(underprocess the syllabus had changed)', modules:0 },
        { code: 'CAG', name: 'Computer Aided Engineering and Drawing',modules: 1},
        { code: 'COA', name: 'Computer Organisaion and Architecture', modules: 5 },
        { code: 'EP', name: 'Engineering Physics', modules: 5 },
        { code: 'FAM', name: 'Fundamentals of Artificial Intelligence ', modules: 5 },
        { code: 'PSC', name: 'Programming in C', modules: 5 },
        { code: 'PCN', name: 'English', modules: 5 },
        { code: 'IPR', name: 'Intelluctual Property rights', modules: 5 }
    ],
    2: [
        { code: 'CMT', name: 'Computational Mathematics', modules: 5 },
        { code: 'PIP', name: 'Programming in Python', modules: 5 },
        { code: 'BEEE', name: 'Basic Electronics Engineering', modules: 5 },
        { code: 'FDS', name: 'Data Science', modules: 5 },
        { code: 'FDT', name: 'Data Structures', modules: 5 },
        { code: 'KAN', name: 'Kannada Samskruthi', modules: 5 },
        { code: 'EVS', name: 'Environmental Studies', modules: 5 },
        { code: 'ICN', name: 'Indian Constitution', modules: 0 }
    ],
    3: [
        { code: 'PSM', name: 'Probability theory And Statistical', modules: 5 },
        { code: 'OOP', name: 'Object Oriented Program', modules: 5 },
        { code: 'OS', name: 'Operating System', modules: 5 },
        { code: 'WEB', name: 'Web Technology', modules: 5 },
        { code: 'SE', name: 'Software Engineering', modules: 5 },
        { code: 'CN', name: 'Computer Networks ', modules: 5 },
        { code: 'IOT', name: 'Internet of Things', modules: 5 },
        { code: 'CLE', name: 'Cyber Law and ethics ', modules: 5 }
    ],
    4: [
        { code: 'PSM', name: 'Probability theory And Statistical', modules: 5 },
        { code: 'OOP', name: 'Object Oriented Program', modules: 5 },
        { code: 'OS', name: 'Operating System', modules: 5 },
        { code: 'DAA', name: 'Data Analysis of Algorithm', modules: 5 },
        { code: 'DADV', name: 'Data Analysis and Data Visualization', modules: 5 },
        { code: 'CN', name: 'Computer Networks ', modules: 5 },
        { code: 'DBMS', name: 'Data Management System ', modules: 5 },
        { code: 'LSE', name: 'Life Skills for Engineers ', modules: 5 }
    ],
    5: [
        { code: 'ML', name: 'Machine Learning', modules: 5 },
        { code: 'AI', name: 'Artificial Intelligence', modules: 5 },
        { code: 'DS', name: 'Data Science', modules: 5 },
        { code: 'CC', name: 'Cloud Computing', modules: 5 },
        { code: 'IOT', name: 'Internet of Things', modules: 5 },
        { code: 'BC', name: 'Block Chain Technology', modules: 5 }
    ],
    6: [
        { code: 'DL', name: 'Deep Learning', modules: 5 },
        { code: 'NLP', name: 'Natural Language Processing', modules: 5 },
        { code: 'CV', name: 'Computer Vision', modules: 5 },
        { code: 'BDA', name: 'Big Data Analytics', modules: 5 },
        { code: 'IS', name: 'Information Security', modules: 5 },
        { code: 'RL', name: 'Reinforcement Learning', modules: 5 }
    ],
    7: [
        { code: 'PROJECT', name: 'Major Project', modules: 5 },
        { code: 'SEMINAR', name: 'Technical Seminar', modules: 5 },
        { code: 'INTERN', name: 'Internship', modules: 5 },
        { code: 'ELEC1', name: 'Professional Elective-I', modules: 5 },
        { code: 'ELEC2', name: 'Professional Elective-II', modules: 5 }
    ],
    8: [
        { code: 'PROJECT2', name: 'Major Project-II', modules: 5 },
        { code: 'COMP', name: 'Comprehensive Exam', modules: 5 },
        { code: 'ELEC3', name: 'Professional Elective-III', modules: 5 },
        { code: 'ELEC4', name: 'Professional Elective-IV', modules: 5 },
        { code: 'ETHICS', name: 'Professional Ethics', modules: 5 }
    ]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    
    // Check if admin was logged in before page reload
    if (isAdminLoggedIn) {
        showAdminPanel();
        populateSubjectSelect();
        loadContentManagement();
    }
});

function initializeApp() {
    // Load content from backend
    loadContentFromBackend();
    
    // Setup mobile menu
    setupMobileMenu();
}

async function loadContentFromBackend() {
    try {
        console.log('Loading content from:', `${API_BASE}/content`);
        const response = await fetch(`${API_BASE}/content`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Raw data from server:', data);
        
        // Convert backend data to frontend format
        contentData = {};
        if (Array.isArray(data)) {
            data.forEach(item => {
                if (!contentData[item.semester]) {
                    contentData[item.semester] = {};
                }
                if (!contentData[item.semester][item.subject]) {
                    contentData[item.semester][item.subject] = {};
                }
                if (!contentData[item.semester][item.subject][item.content_type]) {
                    contentData[item.semester][item.subject][item.content_type] = [];
                }
                
                contentData[item.semester][item.subject][item.content_type].push({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    file: {
                        name: item.file_name,
                        url: `${API_BASE}/file/${item.id}`,
                        size: item.file_size,
                        type: item.file_type
                    }
                });
            });
        }
        
        console.log('Content loaded from backend:', contentData);
        updateSemesterCards();
        
        // Show success message if content was loaded
        if (Object.keys(contentData).length > 0) {
            console.log('✅ Content loaded successfully!');
        } else {
            console.log('ℹ️ No content found in database');
        }
        
    } catch (error) {
        console.error('Error loading content from backend:', error);
        console.log('Will retry in 3 seconds...');
        
        // Retry after 3 seconds
        setTimeout(() => {
            loadContentFromBackend();
        }, 3000);
        
        // Fallback to empty data for now
        contentData = {};
        updateSemesterCards();
    }
}

function setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
    
    // Setup dropdown toggles for mobile
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.classList.toggle('active');
            }
        });
    });
}

function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Admin Functions
function showAdminLogin() {
    document.getElementById('admin-modal').style.display = 'block';
}

function hideAdminLogin() {
    document.getElementById('admin-modal').style.display = 'none';
    document.getElementById('admin-username').value = '';
    document.getElementById('admin-password').value = '';
}

function adminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    // Simple authentication (in production, this would be server-side)
    if (username === 'Prem' && password === 'Pree0507') {
        isAdminLoggedIn = true;
        localStorage.setItem('adminLoggedIn', 'true');
        hideAdminLogin();
        showAdminPanel();
        populateSubjectSelect();
        loadContentManagement();
    } else {
        alert('Invalid credentials!');
    }
}

function adminLogout() {
    // Confirm logout
    if (confirm('Are you sure you want to logout?')) {
        isAdminLoggedIn = false;
        localStorage.removeItem('adminLoggedIn');
        document.getElementById('admin-panel').style.display = 'none';
        // Reload the page to reset the view
        location.reload();
    }
}

function showAdminPanel() {
    document.getElementById('admin-panel').style.display = 'block';
}

function showAdminTab(tab) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab
    event.target.classList.add('active');
    document.getElementById(tab + '-tab').classList.add('active');
    
    if (tab === 'manage') {
        loadContentManagement();
    }
}

function populateSubjectSelect() {
    const semesterSelect = document.getElementById('semester-select');
    const subjectSelect = document.getElementById('subject-select');
    
    semesterSelect.addEventListener('change', function() {
        const semester = this.value;
        subjectSelect.innerHTML = '<option value="">Select Subject</option>';
        
        if (semester && semesterSubjects[semester]) {
            semesterSubjects[semester].forEach(subject => {
                const option = document.createElement('option');
                option.value = subject.code;
                option.textContent = `${subject.code} - ${subject.name}`;
                subjectSelect.appendChild(option);
            });
        }
    });
}

async function uploadContent(event) {
    event.preventDefault();
    
    // Ensure admin is still logged in
    if (!isAdminLoggedIn) {
        alert('Admin session expired. Please login again.');
        return;
    }
    
    const semester = document.getElementById('semester-select').value;
    const subject = document.getElementById('subject-select').value;
    const contentType = document.getElementById('content-type').value;
    const title = document.getElementById('content-title').value;
    const file = document.getElementById('file-upload').files[0];
    const description = document.getElementById('content-description').value;
    
    if (!semester || !subject || !contentType || !title || !file) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Show loading indicator
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Uploading...';
    submitButton.disabled = true;
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('semester', semester);
    formData.append('subject', subject);
    // server expects 'contentType' field name as used in server.js
    formData.append('contentType', contentType);
    formData.append('title', title);
    formData.append('description', description);
    // Multer on server expects field name 'file'
    formData.append('file', file);
    
    try {
        // Check if server is running
        console.log('Starting upload process...');
        console.log('API Base URL:', API_BASE);
        
        // Skip server connection test - just try to upload directly
        
        // Debug: log FormData keys and file info
        console.log('Uploading with FormData:');
        for (let pair of formData.entries()) {
            if (pair[0] === 'file') {
                console.log(pair[0], pair[1].name, pair[1].size, pair[1].type);
            } else {
                console.log(pair[0], pair[1]);
            }
        }

        const response = await fetch(`${API_BASE}/upload`, {
            method: 'POST',
            body: formData
        });

        // Check if response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Try to parse JSON; if that fails, read text for debugging
        let result;
        const text = await response.text();
        console.log('Server response text:', text);
        
        try {
            result = JSON.parse(text);
            console.log('Parsed result:', result);
        } catch (e) {
            console.error('Non-JSON response from server:', text);
            console.error('Parse error:', e);
            
            // Reset button state on parse error
            const submitButton = event.target.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.textContent = 'Upload Content';
                submitButton.disabled = false;
            }
            
            alert('Upload failed. Server returned non-JSON response:\n' + text.substring(0, 200) + '...');
            return;
        }
        
        if (result.success) {
            alert('Content uploaded successfully!');
            
            // Reset form and update UI
            event.target.reset();
            
            // Only refresh content management if visible - don't reload all backend data
            if (document.getElementById('manage-tab').classList.contains('active')) {
                // Load only the new content without affecting admin session
                await loadContentFromBackend();
                loadContentManagement();
            }
            
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        } else {
            // Show detailed server error when available
            const message = result.error || 'Unknown server error';
            const details = result.details ? ("\nDetails: " + result.details) : '';
            alert('Upload failed: ' + message + details);
            console.error('Upload response:', result);
        }
    } catch (error) {
        console.error('Upload error:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        
        // Reset button state on error
        const submitButton = event.target.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Upload Content';
            submitButton.disabled = false;
        }
        
        alert('Upload failed: ' + error.message + '\n\nCheck console for more details.');
    }
}

function loadContentManagement() {
    const contentList = document.getElementById('content-list');
    contentList.innerHTML = '';
    
    if (Object.keys(contentData).length === 0) {
        contentList.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 40px;">No content uploaded yet.</p>';
        return;
    }
    
    Object.keys(contentData).forEach(semester => {
        Object.keys(contentData[semester]).forEach(subject => {
            Object.keys(contentData[semester][subject]).forEach(type => {
                contentData[semester][subject][type].forEach(content => {
                    const contentItem = document.createElement('div');
                    contentItem.className = 'content-item-admin';
                    contentItem.innerHTML = `
                        <div class="content-info">
                            <h4>${content.title}</h4>
                            <p>Semester ${semester} • ${subject} • ${type.replace('-', ' ')} • ${content.file.name}</p>
                            ${content.description ? `<p style="font-size: 0.85rem; margin-top: 5px;">${content.description}</p>` : ''}
                        </div>
                        <div class="content-actions">
                            <button class="btn btn-small btn-outline" onclick="openFile('${content.id}')">Preview</button>
                            <button class="btn btn-small btn-danger" onclick="deleteContent('${semester}', '${subject}', '${type}', '${content.id}')">Delete</button>
                        </div>
                    `;
                    contentList.appendChild(contentItem);
                });
            });
        });
    });
}

async function deleteContent(semester, subject, type, contentId) {
    if (confirm('Are you sure you want to delete this content?')) {
        try {
            const response = await fetch(`${API_BASE}/content/${contentId}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Reload content from backend
                await loadContentFromBackend();
                loadContentManagement();
                
                // Refresh current semester view if it's being displayed
                if (currentSemester) {
                    loadSemester(currentSemester);
                }
            } else {
                alert('Delete failed: ' + result.error);
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Delete failed. Please try again.');
        }
    }
}

function previewContent(url) {
    window.open(url, '_blank');
}

function openFile(fileId) {
    // Open file directly from backend
    const fileUrl = `${API_BASE}/file/${fileId}`;
    window.open(fileUrl, '_blank');
}

// Semester and Subject Functions
async function loadSemester(semester) {
    currentSemester = semester;
    
    // Reload content data from backend
    await loadContentFromBackend();
    console.log('Loading semester', semester, 'with contentData:', contentData);
    
    // Hide semester grid and show subject details
    document.getElementById('semester-grid').style.display = 'none';
    document.getElementById('subject-details').style.display = 'block';
    
    // Update semester title
    const semesterTitle = document.getElementById('semester-title');
    const semesterInfo = getSemesterInfo(semester);
    semesterTitle.innerHTML = `
        <h2>${semesterInfo.name}</h2>
        <p>${semesterInfo.cycle}</p>
    `;
    
    // Load subjects
    const subjectsGrid = document.getElementById('subjects-grid');
    subjectsGrid.innerHTML = '';
    
    if (semesterSubjects[semester]) {
        semesterSubjects[semester].forEach(subject => {
            const subjectCard = createSubjectCard(semester, subject);
            subjectsGrid.appendChild(subjectCard);
        });
    }
}

function getSemesterInfo(semester) {
    const semesterData = {
        1: { name: '1st Semester', cycle: 'PC/EC Cycle' },
        2: { name: '2nd Semester', cycle: 'PC/EC Cycle' },
        3: { name: '3rd Semester', cycle: 'Core Engineering' },
        4: { name: '4th Semester', cycle: 'Core Engineering' },
        5: { name: '5th Semester', cycle: 'Specialization' },
        6: { name: '6th Semester', cycle: 'Specialization' },
        7: { name: '7th Semester', cycle: 'Advanced' },
        8: { name: '8th Semester', cycle: 'Advanced' }
    };
    
    return semesterData[semester] || { name: 'Unknown Semester', cycle: 'Unknown' };
}

function createSubjectCard(semester, subject) {
    const card = document.createElement('div');
    card.className = 'subject-card';
    
    const subjectContent = contentData[semester] && contentData[semester][subject.code] 
        ? contentData[semester][subject.code] : {};
    
    // Debug logging (remove in production)
    console.log('Creating card for semester:', semester, 'subject:', subject.code);
    console.log('Available content data:', contentData);
    console.log('Subject content for', subject.code, ':', subjectContent);
    
    const contentTypes = ['notes', 'module', 'question-bank', 'model-paper/lab-manual'];
    let contentHTML = '';
    
    contentTypes.forEach(type => {
        const typeLabel = type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        const items = subjectContent[type] || [];
        
        let itemsHTML = '';
        if (items.length > 0) {
            itemsHTML = items.map(item => 
                `<a href="#" onclick="openFile('${item.id}')" class="content-item" title="${item.description || ''}">${item.title}</a>`
            ).join('');
        } else {
            // Generate module placeholders for 'module' type
            if (type === 'module' && subject.modules > 0) {
                for (let i = 1; i <= subject.modules; i++) {
                    itemsHTML += `<span class="content-item not-uploaded">Module ${i} - NOT UPLOADED</span>`;
                }
            } else {
                itemsHTML = `<span class="content-item not-uploaded">NOT UPLOADED</span>`;
            }
        }
        
        contentHTML += `
            <div class="content-type">
                <h4>${typeLabel}</h4>
                <div class="content-items">${itemsHTML}</div>
            </div>
        `;
    });
    
    card.innerHTML = `
        <div class="subject-header">
            <h3>${subject.name}</h3>
            <p>Subject Code: ${subject.code}</p>
        </div>
        <div class="subject-content">
            <div class="content-types">
                ${contentHTML}
            </div>
        </div>
    `;
    
    return card;
}

function showSemesterGrid() {
    // Load fresh content from backend
    loadContentFromBackend();
    
    document.getElementById('subject-details').style.display = 'none';
    document.getElementById('semester-grid').style.display = 'block';
    currentSemester = null;
}

function updateSemesterCards() {
    // Update each semester card to show content counts
    for (let semester = 1; semester <= 8; semester++) {
        const semesterCard = document.querySelector(`[onclick="loadSemester(${semester})"]`);
        if (semesterCard) {
            const subjectCountElement = semesterCard.querySelector('.subject-count');
            if (subjectCountElement) {
                const totalContent = getSemesterContentCount(semester);
                const subjectCount = semesterSubjects[semester] ? semesterSubjects[semester].length : 0;
                subjectCountElement.textContent = `${subjectCount} subjects • ${totalContent} materials`;
            }
        }
    }
}

function getSemesterContentCount(semester) {
    let totalContent = 0;
    if (contentData[semester]) {
        Object.keys(contentData[semester]).forEach(subject => {
            Object.keys(contentData[semester][subject]).forEach(type => {
                totalContent += contentData[semester][subject][type].length;
            });
        });
    }
    return totalContent;
}

function initializeDefaultContent() {
    // Initialize with some sample content structure
    contentData = {};
    localStorage.setItem('academicContent', JSON.stringify(contentData));
}

// Utility Functions
function downloadFile(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Search functionality (for future implementation)
function searchContent(query) {
    // This would search through all content
    console.log('Searching for:', query);
}

// Theme toggle (for future implementation)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Handle window resize
window.addEventListener('resize', function() {
    const navMenu = document.getElementById('nav-menu');
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        document.getElementById('hamburger').classList.remove('active');
        
        // Close mobile dropdowns
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
});

// Handle clicks outside modals
window.addEventListener('click', function(event) {
    const modal = document.getElementById('admin-modal');
    if (event.target === modal) {
        hideAdminLogin();
    }
});

// Keyboard accessibility
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        hideAdminLogin();
        
        // Close mobile menu
        const navMenu = document.getElementById('nav-menu');
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            document.getElementById('hamburger').classList.remove('active');
        }
    }
});

// Service Worker Registration (for future PWA implementation)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // navigator.serviceWorker.register('/sw.js');
    });
}

// IndexedDB functions for file storage
let db;

function initIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('AcademicContentDB', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            if (!database.objectStoreNames.contains('files')) {
                database.createObjectStore('files', { keyPath: 'id' });
            }
        };
    });
}

function storeFileInIndexedDB(file, id) {
    if (!db) {
        initIndexedDB().then(() => storeFileInIndexedDB(file, id));
        return;
    }
    
    const transaction = db.transaction(['files'], 'readwrite');
    const store = transaction.objectStore('files');
    
    const reader = new FileReader();
    reader.onload = function(e) {
        store.put({
            id: id,
            data: e.target.result,
            name: file.name,
            type: file.type,
            size: file.size
        });
    };
    reader.readAsArrayBuffer(file);
}

function getFileFromIndexedDB(id) {
    return new Promise((resolve, reject) => {
        if (!db) {
            initIndexedDB().then(() => getFileFromIndexedDB(id).then(resolve).catch(reject));
            return;
        }
        
        const transaction = db.transaction(['files'], 'readonly');
        const store = transaction.objectStore('files');
        const request = store.get(id);
        
        request.onsuccess = () => {
            if (request.result) {
                const blob = new Blob([request.result.data], { type: request.result.type });
                const url = URL.createObjectURL(blob);
                resolve(url);
            } else {
                reject('File not found');
            }
        };
        request.onerror = () => reject(request.error);
    });
}

// Test function to verify functionality
function testUpload() {
    console.log('Testing upload functionality...');
    console.log('Current contentData:', contentData);
    console.log('LocalStorage data:', JSON.parse(localStorage.getItem('academicContent') || '{}'));
}

// Export functions for global access
window.loadSemester = loadSemester;
window.showSemesterGrid = showSemesterGrid;
window.showAdminLogin = showAdminLogin;
window.hideAdminLogin = hideAdminLogin;
window.adminLogin = adminLogin;
window.adminLogout = adminLogout;
window.showAdminTab = showAdminTab;
window.uploadContent = uploadContent;
window.deleteContent = deleteContent;
window.previewContent = previewContent;
window.openFile = openFile;
window.testUpload = testUpload;