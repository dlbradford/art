const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
const PORT = process.env.PORT || 3000;

// Load environment variables (or use defaults)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const SESSION_SECRET = process.env.SESSION_SECRET || 'your-secret-key-change-in-production';

// Cloudinary configuration
const USE_CLOUDINARY = process.env.CLOUDINARY_CLOUD_NAME ? true : false;

if (USE_CLOUDINARY) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('✅ Cloudinary configured - images will be stored in cloud');
} else {
  console.log('⚠️  Cloudinary not configured - using local storage (images will be lost on restart)');
}

// Data file paths
const DATA_DIR = './data';
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const GALLERY_FILE = path.join(DATA_DIR, 'gallery.json');
const LINKS_FILE = path.join(DATA_DIR, 'links.json');
const REQUESTS_FILE = path.join(DATA_DIR, 'requests.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const ABOUT_FILE = path.join(DATA_DIR, 'about.json');

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

  // Initialize settings
  if (!fs.existsSync(SETTINGS_FILE)) {
    const defaultSettings = {
      backgroundColor: '#ffffff',
      postBackground: '#ffffff',
      textColor: '#212529'
    };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2));
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

// Helper function to lighten a hex color by a percentage
function lightenColor(hex, percent) {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert to RGB
  let r = parseInt(hex.substr(0, 2), 16);
  let g = parseInt(hex.substr(2, 2), 16);
  let b = parseInt(hex.substr(4, 2), 16);
  
  // Lighten by moving towards white (255)
  r = Math.round(r + (255 - r) * (percent / 100));
  g = Math.round(g + (255 - g) * (percent / 100));
  b = Math.round(b + (255 - b) * (percent / 100));
  
  // Ensure values are within 0-255
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  
  // Convert back to hex
  const rHex = r.toString(16).padStart(2, '0');
  const gHex = g.toString(16).padStart(2, '0');
  const bHex = b.toString(16).padStart(2, '0');
  
  return '#' + rHex + gHex + bHex;
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Make settings and isAdmin available to all templates
app.use((req, res, next) => {
  const settings = readJSON(SETTINGS_FILE);
  // Calculate header background as 10% lighter than main background
  settings.headerBackground = lightenColor(settings.backgroundColor, 10);
  res.locals.settings = settings;
  res.locals.isAdmin = req.session.isAdmin || false;
  next();
});

// File upload configuration
let storage;

if (USE_CLOUDINARY) {
  // Use Cloudinary storage
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'donna-art-gallery',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ width: 2000, height: 2000, crop: 'limit' }]
    }
  });
} else {
  // Use local disk storage (for development)
  storage = multer.diskStorage({
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
}

const upload = multer({ storage: storage });

// Auth middleware
function requireAdmin(req, res, next) {
  if (req.session.isAdmin) {
    next();
  } else {
    res.redirect('/admin/login');
  }
}

// Routes - Public Pages
app.get('/', (req, res) => {
  const posts = readJSON(POSTS_FILE);
  const recentPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
  
  const images = readJSON(GALLERY_FILE);
  const carouselImages = images.filter(img => img.inCarousel === true);
  
  res.render('index', { 
    posts: recentPosts,
    carouselImages: carouselImages,
    title: 'Home',
    description: 'Contemporary mixed media artwork by Donna McAdams. Explore original paintings, abstract art, and commission custom pieces.',
    canonicalPath: '/',
    ogImage: 'https://artbydonnamcadams.com/uploads/hero-image.jpg'
  });
});

app.get('/blogroll', (req, res) => {
  const posts = readJSON(POSTS_FILE);
  const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.render('blogroll', { 
    posts: sortedPosts,
    title: 'Blog',
    description: 'Read about Donna McAdams\' artistic process, inspiration, and latest works. Insights into contemporary mixed media art.',
    canonicalPath: '/blogroll'
  });
});

app.get('/gallery', (req, res) => {
  const images = readJSON(GALLERY_FILE);
  const sortedImages = images.sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at));
  res.render('gallery', { 
    images: sortedImages,
    title: 'Gallery',
    description: 'View Donna McAdams\' portfolio of contemporary mixed media artwork. Browse original paintings and abstract pieces.',
    canonicalPath: '/gallery'
  });
});

app.get('/requests', (req, res) => {
  res.render('requests', {
    title: 'Commission Request',
    description: 'Request a custom artwork commission from Donna McAdams. Get a personalized original painting for your space.',
    canonicalPath: '/requests'
  });
});

app.get('/links', (req, res) => {
  const links = readJSON(LINKS_FILE);
  res.render('links', { 
    links,
    title: 'Links',
    description: 'Useful resources and links related to contemporary art, galleries, and artistic inspiration.',
    canonicalPath: '/links'
  });
});

app.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact',
    description: 'Get in touch with Donna McAdams. Contact for commissions, exhibitions, or general inquiries about artwork.',
    canonicalPath: '/contact'
  });
});

app.get('/about', (req, res) => {
  const aboutData = readJSON(ABOUT_FILE);
  res.render('about', {
    about: aboutData,
    title: 'About',
    description: 'Learn about Donna McAdams - Connecticut-based contemporary artist. Discover her artistic journey, philosophy, and background.',
    canonicalPath: '/about'
  });
});

// Sitemap.xml
app.get('/sitemap.xml', (req, res) => {
  const posts = readJSON(POSTS_FILE);
  const images = readJSON(GALLERY_FILE);
  
  const baseUrl = 'https://artbydonnamcadams.com';
  const today = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/gallery</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/blogroll</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/requests</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/links</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;

  // Add blog posts
  posts.forEach(post => {
    const postDate = post.updated_at || post.created_at || today;
    sitemap += `  <url>
    <loc>${baseUrl}/blogroll#post-${post.id}</loc>
    <lastmod>${postDate.split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  });

  sitemap += '</urlset>';
  
  res.header('Content-Type', 'application/xml');
  res.send(sitemap);
});

// robots.txt
app.get('/robots.txt', (req, res) => {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://artbydonnamcadams.com/sitemap.xml
`;
  
  res.header('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

// Admin Routes - Login/Logout
app.get('/admin/login', (req, res) => {
  res.render('admin/login', { error: null });
});

app.post('/admin/login', (req, res) => {
  const { password } = req.body;
  
  if (password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    res.redirect('/admin/dashboard');
  } else {
    res.render('admin/login', { error: 'Invalid password' });
  }
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Admin Routes - Dashboard
app.get('/admin/dashboard', requireAdmin, (req, res) => {
  const posts = readJSON(POSTS_FILE);
  const images = readJSON(GALLERY_FILE);
  const requests = readJSON(REQUESTS_FILE);
  const links = readJSON(LINKS_FILE);
  
  res.render('admin/dashboard', {
    stats: {
      posts: posts.length,
      images: images.length,
      requests: requests.length,
      pendingRequests: requests.filter(r => r.status === 'incomplete').length,
      links: links.length
    }
  });
});

// Admin Routes - Blog Management
app.get('/admin/blog', requireAdmin, (req, res) => {
  const posts = readJSON(POSTS_FILE);
  const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.render('admin/blog', { posts: sortedPosts });
});

// Admin Routes - Gallery Management
app.get('/admin/gallery', requireAdmin, (req, res) => {
  const images = readJSON(GALLERY_FILE);
  const sortedImages = images.sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at));
  res.render('admin/gallery', { images: sortedImages });
});

// Admin Routes - Request Management
app.get('/admin/requests', requireAdmin, (req, res) => {
  const requests = readJSON(REQUESTS_FILE);
  const sortedRequests = requests.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
  res.render('admin/requests', { requests: sortedRequests });
});

// Admin Routes - Links Management
app.get('/admin/links', requireAdmin, (req, res) => {
  const links = readJSON(LINKS_FILE);
  res.render('admin/links', { links });
});

// Admin Routes - About Page
app.get('/admin/about/edit', requireAdmin, (req, res) => {
  const about = readJSON(ABOUT_FILE);
  res.render('admin/about-edit', { about });
});

// Admin Routes - Settings
app.get('/admin/settings', requireAdmin, (req, res) => {
  const settings = readJSON(SETTINGS_FILE);
  res.render('admin/settings', { settings });
});

// API Routes - Blog Posts
app.get('/api/posts', (req, res) => {
  const posts = readJSON(POSTS_FILE);
  const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json(sortedPosts);
});

app.post('/api/posts', requireAdmin, upload.single('image'), (req, res) => {
  const { title, content, date, imagePosition } = req.body;
  const posts = readJSON(POSTS_FILE);
  
  const newPost = {
    id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
    title,
    content,
    date,
    image: req.file ? req.file.filename : null,
    imagePosition: imagePosition || 'above', // 'above' or 'below'
    created_at: new Date().toISOString()
  };
  
  posts.push(newPost);
  writeJSON(POSTS_FILE, posts);
  
  res.json({ id: newPost.id, success: true });
});

app.delete('/api/posts/:id', requireAdmin, (req, res) => {
  const posts = readJSON(POSTS_FILE);
  const post = posts.find(p => p.id === parseInt(req.params.id));
  
  // Delete associated image if exists
  if (post && post.image) {
    const filePath = path.join('./public/uploads', post.image);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  
  const filteredPosts = posts.filter(p => p.id !== parseInt(req.params.id));
  writeJSON(POSTS_FILE, filteredPosts);
  res.json({ success: true });
});

app.patch('/api/posts/:id', requireAdmin, upload.single('image'), (req, res) => {
  const { title, content, date, imagePosition, removeImage } = req.body;
  const posts = readJSON(POSTS_FILE);
  const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
  
  if (postIndex === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  const post = posts[postIndex];
  
  // Handle image removal
  if (removeImage === 'true' && post.image) {
    const filePath = path.join('./public/uploads', post.image);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    post.image = null;
    post.imagePosition = null;
  }
  
  // Handle image replacement
  if (req.file) {
    // Delete old image if exists
    if (post.image) {
      const oldFilePath = path.join('./public/uploads', post.image);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }
    post.image = req.file.filename;
    post.imagePosition = imagePosition || 'above';
  } else if (imagePosition && post.image) {
    // Just update position if image exists
    post.imagePosition = imagePosition;
  }
  
  // Update text fields
  post.title = title;
  post.content = content;
  post.date = date;
  post.updated_at = new Date().toISOString();
  
  writeJSON(POSTS_FILE, posts);
  
  res.json({ success: true, post });
});

// API Routes - Gallery
app.post('/api/gallery', requireAdmin, upload.single('image'), (req, res) => {
  const { title, description } = req.body;
  
  // Cloudinary stores full URL in req.file.path, local storage uses filename
  const imageUrl = USE_CLOUDINARY ? req.file.path : `/uploads/${req.file.filename}`;
  const filename = USE_CLOUDINARY ? req.file.filename : req.file.filename; // For Cloudinary, this is the public_id
  
  const images = readJSON(GALLERY_FILE);
  
  const newImage = {
    id: images.length > 0 ? Math.max(...images.map(i => i.id)) + 1 : 1,
    title,
    filename: imageUrl, // Store full URL (Cloudinary) or relative path (local)
    description,
    uploaded_at: new Date().toISOString(),
    cloudinary: USE_CLOUDINARY
  };
  
  images.push(newImage);
  writeJSON(GALLERY_FILE, images);
  
  res.json({ id: newImage.id, filename: imageUrl, success: true });
});

app.delete('/api/gallery/:id', requireAdmin, async (req, res) => {
  const images = readJSON(GALLERY_FILE);
  const image = images.find(i => i.id === parseInt(req.params.id));
  
  if (image) {
    if (image.cloudinary && USE_CLOUDINARY) {
      // Extract public_id from Cloudinary URL
      // URL format: https://res.cloudinary.com/cloud_name/image/upload/v123456/folder/filename.jpg
      try {
        const urlParts = image.filename.split('/');
        const filenamePart = urlParts[urlParts.length - 1].split('.')[0]; // Get filename without extension
        const folder = urlParts[urlParts.length - 2];
        const publicId = `${folder}/${filenamePart}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
      }
    } else {
      // Local file deletion
      const filePath = path.join('./public/uploads', path.basename(image.filename));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }
  
  const filteredImages = images.filter(i => i.id !== parseInt(req.params.id));
  writeJSON(GALLERY_FILE, filteredImages);
  
  res.json({ success: true });
});

app.patch('/api/gallery/:id', requireAdmin, (req, res) => {
  const { title, description, inCarousel } = req.body;
  const images = readJSON(GALLERY_FILE);
  const imageIndex = images.findIndex(i => i.id === parseInt(req.params.id));
  
  if (imageIndex === -1) {
    return res.status(404).json({ error: 'Image not found' });
  }
  
  // Update title and description
  images[imageIndex].title = title;
  images[imageIndex].description = description;
  
  // Update carousel status if provided
  if (inCarousel !== undefined) {
    images[imageIndex].inCarousel = inCarousel === true || inCarousel === 'true';
  }
  
  images[imageIndex].updated_at = new Date().toISOString();
  
  writeJSON(GALLERY_FILE, images);
  
  res.json({ success: true, image: images[imageIndex] });
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
    status: 'incomplete'
  };
  
  requests.push(newRequest);
  writeJSON(REQUESTS_FILE, requests);
  
  res.json({ id: newRequest.id, success: true });
});

app.patch('/api/requests/:id', requireAdmin, (req, res) => {
  const { status } = req.body;
  const requests = readJSON(REQUESTS_FILE);
  
  const request = requests.find(r => r.id === parseInt(req.params.id));
  if (request) {
    request.status = status;
    writeJSON(REQUESTS_FILE, requests);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Request not found' });
  }
});

app.delete('/api/requests/:id', requireAdmin, (req, res) => {
  const requests = readJSON(REQUESTS_FILE);
  const request = requests.find(r => r.id === parseInt(req.params.id));
  
  if (request && request.images) {
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

// API Routes - Links
app.post('/api/links', requireAdmin, (req, res) => {
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
  
  res.json({ id: newLink.id, success: true });
});

app.delete('/api/links/:id', requireAdmin, (req, res) => {
  const links = readJSON(LINKS_FILE);
  const filteredLinks = links.filter(l => l.id !== parseInt(req.params.id));
  writeJSON(LINKS_FILE, filteredLinks);
  res.json({ success: true });
});

// API Routes - Settings
app.post('/api/settings', requireAdmin, (req, res) => {
  const { backgroundColor, postBackground, textColor, carouselTimer, carouselHeight } = req.body;
  
  const settings = {
    backgroundColor,
    postBackground,
    textColor,
    carouselTimer: carouselTimer || 5,
    carouselHeight: carouselHeight || 25
  };
  
  writeJSON(SETTINGS_FILE, settings);
  res.json({ success: true });
});

// API Routes - About Page
app.post('/api/about', requireAdmin, (req, res) => {
  const {
    heading,
    introTitle, introContent,
    journeyTitle, journeyItems,
    approachTitle, approachContent,
    statementTitle, statementContent,
    studioTitle, studioContent
  } = req.body;
  
  const aboutData = {
    heading,
    introduction: {
      title: introTitle,
      content: introContent
    },
    journey: {
      title: journeyTitle,
      items: journeyItems.split('\n').filter(item => item.trim())
    },
    approach: {
      title: approachTitle,
      content: approachContent
    },
    statement: {
      title: statementTitle,
      content: statementContent
    },
    studio: {
      title: studioTitle,
      content: studioContent
    }
  };
  
  writeJSON(ABOUT_FILE, aboutData);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server');
  console.log(`Admin password: ${ADMIN_PASSWORD}`);
});
