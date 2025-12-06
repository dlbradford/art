# Art by Donna - Personal Art Portfolio & Blog Website

A full-featured art portfolio and blog website with an integrated database backend, built with Node.js, Express, and SQLite.

## Features

- **Blog System**: Create, publish, and manage blog posts
- **Image Gallery**: Upload and showcase artwork with titles and descriptions
- **Commission Requests**: Dedicated page for potential clients to request custom work
- **Links Management**: Curate useful links and resources
- **Contact Form**: Easy way for visitors to get in touch
- **About Page**: Share your story and artistic journey
- **Self-contained Database**: SQLite database stores all content locally
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Distinctive Design**: Clean, brutalist-inspired aesthetic that matches your mockup

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: SQLite3 (file-based, no external database needed)
- **Template Engine**: EJS (Embedded JavaScript)
- **File Uploads**: Multer for handling image uploads
- **Frontend**: Vanilla JavaScript, CSS3 with animations

## Project Structure

```
donna-art-site/
├── server.js              # Main application server
├── package.json           # Project dependencies
├── database.db           # SQLite database (created automatically)
├── public/               # Static files
│   ├── style.css        # Main stylesheet
│   ├── script.js        # Client-side JavaScript
│   └── uploads/         # Uploaded images (created automatically)
└── views/               # EJS templates
    ├── layout.ejs       # Main layout template
    ├── index.ejs        # Home page
    ├── blogroll.ejs     # Blog posts page
    ├── gallery.ejs      # Image gallery
    ├── requests.ejs     # Commission requests
    ├── links.ejs        # Links page
    ├── contact.ejs      # Contact form
    └── about.ejs        # About page
```

## Installation & Setup

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Local Development

1. **Navigate to the project directory**:
   ```bash
   cd donna-art-site
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000`

### Development Mode (with auto-restart)

For development with automatic server restart on file changes:

```bash
npm run dev
```

## Database

The application uses JSON files for data storage, making it simple and portable with no external database dependencies. All data is stored in the `data/` directory:

- `posts.json` - Blog posts
- `gallery.json` - Gallery images metadata
- `links.json` - Curated links

This approach makes the site:
- Easy to deploy anywhere
- Simple to backup (just copy the data folder)
- No database configuration needed
- Version control friendly

### Database Tables

- **posts**: Blog posts with title, content, date
- **gallery_images**: Artwork images with metadata
- **links**: Curated links with descriptions

Sample data is automatically seeded on first run.

## Deployment Options

### Option 1: Traditional Hosting (Heroku, DigitalOcean, AWS)

1. **Heroku**:
   ```bash
   # Install Heroku CLI, then:
   heroku create your-app-name
   git push heroku main
   ```

2. **DigitalOcean App Platform**:
   - Connect your GitHub repository
   - Select Node.js as the runtime
   - Set build command: `npm install`
   - Set run command: `npm start`

3. **AWS EC2**:
   - Launch an EC2 instance
   - Install Node.js
   - Clone your repository
   - Run with PM2 for process management:
     ```bash
     npm install -g pm2
     pm2 start server.js
     ```

### Option 2: Platform as a Service (PaaS)

1. **Render.com** (Recommended for beginners):
   - Connect your GitHub repository
   - Choose "Web Service"
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Free tier available!

2. **Railway.app**:
   - Connect repository
   - Automatically detects Node.js
   - One-click deployment

### Option 3: Serverless (with modifications)

For serverless deployment (Vercel, Netlify), you'll need to:
- Replace SQLite with a cloud database (PostgreSQL, MongoDB)
- Adapt the Express app for serverless functions
- Use cloud storage (AWS S3, Cloudinary) for image uploads

### Important Notes for Deployment

1. **Environment Variables**: Set `PORT` environment variable (most hosts do this automatically)

2. **Database Persistence**: 
   - JSON files will persist on all hosting platforms
   - Regularly backup the `data/` folder
   - Consider version controlling your data files (optional)

3. **File Uploads**:
   - Uploaded images are stored in `public/uploads/`
   - For production, consider using cloud storage (AWS S3, Cloudinary)
   - Ensure write permissions for the uploads directory

4. **Domain**: Connect your custom domain through your hosting provider's settings

## Configuration

### Change Port

Edit `server.js` or set environment variable:
```bash
PORT=8080 npm start
```

### Database Location

The JSON data files are stored in the `data/` directory. Each file is automatically created on first run with sample data.

## Customization

### Styling

Edit `public/style.css` to customize:
- Colors (CSS variables at the top)
- Typography
- Layout spacing
- Animations

### Content

All page content can be edited in the respective EJS template files in the `views/` directory.

### Sample Data

To add or modify sample posts/links, edit the `initializeDatabase()` function in `server.js`.

## Features Roadmap

Potential enhancements:
- [ ] User authentication for admin panel
- [ ] Rich text editor for blog posts
- [ ] Image optimization and thumbnails
- [ ] Search functionality
- [ ] Comments system
- [ ] Social media integration
- [ ] Newsletter signup
- [ ] Analytics dashboard
- [ ] Export/import functionality

## Backup Your Data

**Important**: Regularly backup these files and directories:
- `data/` directory - Contains all your content in JSON format
- `public/uploads/` - Contains uploaded images

## Support & Maintenance

For updates and maintenance:
1. Keep Node.js and npm updated
2. Regularly update dependencies: `npm update`
3. Check for security vulnerabilities: `npm audit`
4. Backup database before major updates

## License

MIT License - Feel free to modify and use for your own portfolio!

## Credits

Website design inspired by brutalist web aesthetics with a focus on simplicity and functionality.

Built with ❤️ for artists and creators.
