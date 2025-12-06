const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Data file paths
const DATA_DIR = './data';
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const GALLERY_FILE = path.join(DATA_DIR, 'gallery.json');
const LINKS_FILE = path.join(DATA_DIR, 'links.json');
const REQUESTS_FILE = path.join(DATA_DIR, 'requests.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize data files
function initializeData() {
  // Initialize posts
  if (!fs.existsSync(POSTS_FILE)) {
    const samplePosts = [
      { 
        id: 1, 
        title: "Welcome to My Art Site", 
        content: "This is my first post! I'm excited to share my artwork and thoughts with you.", 
        date: "2025-01-15" 
      },
      { 
        id: 2, 
        title: "New Series: Abstract Landscapes", 
        content: "I've been working on a new series exploring abstract interpretations of natural landscapes. Using mixed media and bold colors to capture the essence of places I've visited.", 
        date: "2025-01-20" 
      },
      { 
        id: 3, 
        title: "Studio Update", 
        content: "Just finished setting up my new studio space. The natural lighting is perfect for working on larger pieces. Can't wait to see what emerges from this creative environment.", 
        date: "2025-02-01" 
      }
    ];
    fs.writeFileSync(POSTS_FILE, JSON.stringify(samplePosts, null, 2));
  }

  // Initialize gallery
  if (!fs.existsSync(GALLERY_FILE)) {
    fs.writeFileSync(GALLERY_FILE, JSON.stringify([], null, 2));
  }

  // Initialize links
  if (!fs.existsSync(LINKS_FILE)) {
    fs.writeFileSync(LINKS_FILE, JSON.stringify([], null, 2));
  }

  // Initialize requests
  if (!fs.existsSync(REQUESTS_FILE)) {
    fs.writeFileSync(REQUESTS_FILE, JSON.stringify([], null, 2));
  }
}

initializeData();

// Helper functions to read/write JSON
function readJSON(filepath) {
  try {
    const data = fs.readFileSync(filepath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeJSON(filepath, data) {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './public/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Routes - Pages
app.get('/', (req, res) => {
  const posts = readJSON(POSTS_FILE);
  const recentPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
  res.render('index', { posts: recentPosts });
});

app.get('/blogroll', (req, res) => {
  const posts = readJSON(POSTS_FILE);
  const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.render('blogroll', { posts: sortedPosts });
});

app.get('/gallery', (req, res) => {
  const images = readJSON(GALLERY_FILE);
  const sortedImages = images.sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at));
  res.render('gallery', { images: sortedImages });
});

app.get('/requests', (req, res) => {
  const requests = readJSON(REQUESTS_FILE);
  const sortedRequests = requests.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
  res.render('requests', { requests: sortedRequests });
});

app.get('/links', (req, res) => {
  const links = readJSON(LINKS_FILE);
  res.render('links', { links });
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/about', (req, res) => {
  res.render('about');
});

// API Routes - Blog Posts
app.get('/api/posts', (req, res) => {
  const posts = readJSON(POSTS_FILE);
  const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(sortedPosts);
});

app.post('/api/posts', (req, res) => {
  const { title, content, date } = req.body;
  const posts = readJSON(POSTS_FILE);
  
  const newPost = {
    id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
    title,
    content,
    date,
    created_at: new Date().toISOString()
  };
  
  posts.push(newPost);
  writeJSON(POSTS_FILE, posts);
  
  res.json({ id: newPost.id });
});

app.delete('/api/posts/:id', (req, res) => {
  const posts = readJSON(POSTS_FILE);
  const filteredPosts = posts.filter(p => p.id !== parseInt(req.params.id));
  writeJSON(POSTS_FILE, filteredPosts);
  res.json({ success: true });
});

// API Routes - Gallery
app.post('/api/gallery', upload.single('image'), (req, res) => {
  const { title, description } = req.body;
  const filename = req.file.filename;
  
  const images = readJSON(GALLERY_FILE);
  
  const newImage = {
    id: images.length > 0 ? Math.max(...images.map(i => i.id)) + 1 : 1,
    title,
    filename,
    description,
    uploaded_at: new Date().toISOString()
  };
  
  images.push(newImage);
  writeJSON(GALLERY_FILE, images);
  
  res.json({ id: newImage.id, filename });
});

app.delete('/api/gallery/:id', (req, res) => {
  const images = readJSON(GALLERY_FILE);
  const image = images.find(i => i.id === parseInt(req.params.id));
  
  if (image) {
    // Delete the image file
    const filePath = path.join('./public/uploads', image.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  
  const filteredImages = images.filter(i => i.id !== parseInt(req.params.id));
  writeJSON(GALLERY_FILE, filteredImages);
  
  res.json({ success: true });
});

// API Routes - Links
app.post('/api/links', (req, res) => {
  const { title, url, description } = req.body;
  const links = readJSON(LINKS_FILE);
  
  const newLink = {
    id: links.length > 0 ? Math.max(...links.map(l => l.id)) + 1 : 1,
    title,
    url,
    description
  };
  
  links.push(newLink);
  writeJSON(LINKS_FILE, links);
  
  res.json({ id: newLink.id });
});

app.delete('/api/links/:id', (req, res) => {
  const links = readJSON(LINKS_FILE);
  const filteredLinks = links.filter(l => l.id !== parseInt(req.params.id));
  writeJSON(LINKS_FILE, filteredLinks);
  res.json({ success: true });
});

// API Routes - Commission Requests
app.post('/api/requests', upload.array('images', 5), (req, res) => {
  const { name, email, type, size, budget, description, timeline } = req.body;
  const requests = readJSON(REQUESTS_FILE);
  
  const imageFilenames = req.files ? req.files.map(file => file.filename) : [];
  
  const newRequest = {
    id: requests.length > 0 ? Math.max(...requests.map(r => r.id)) + 1 : 1,
    name,
    email,
    type,
    size,
    budget,
    description,
    timeline,
    images: imageFilenames,
    submitted_at: new Date().toISOString(),
    status: 'pending'
  };
  
  requests.push(newRequest);
  writeJSON(REQUESTS_FILE, requests);
  
  res.json({ id: newRequest.id, success: true });
});

app.delete('/api/requests/:id', (req, res) => {
  const requests = readJSON(REQUESTS_FILE);
  const request = requests.find(r => r.id === parseInt(req.params.id));
  
  if (request && request.images) {
    // Delete associated image files
    request.images.forEach(filename => {
      const filePath = path.join('./public/uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  }
  
  const filteredRequests = requests.filter(r => r.id !== parseInt(req.params.id));
  writeJSON(REQUESTS_FILE, filteredRequests);
  
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server');
});
