# Setup Guide - Art Portfolio v3.0

## What's New in v3.0

### ✅ All Requirements Implemented

1. ✅ Gallery shows only images (upload moved to admin)
2. ✅ Lightbox for viewing large format images
3. ✅ Blog add/edit only for logged-in admin
4. ✅ Complete admin section (/admin/dashboard)
5. ✅ No delete buttons on public pages
6. ✅ CSS styling options with color pickers
7. ✅ Header without shadow
8. ✅ Image upload in admin section only
9. ✅ Request tracking (complete/incomplete) with search
10. ✅ Links management in admin section
11. ✅ Social media buttons removed from contact page

## Quick Start (5 Minutes)

### 1. Install
```bash
npm install
```

### 2. Configure Password
```bash
# Copy example env file
cp .env.example .env

# Edit .env and set your password
ADMIN_PASSWORD=YourSecurePassword123
SESSION_SECRET=random-string-at-least-32-characters-long
```

### 3. Start Server
```bash
npm start
```

### 4. Access Admin
- Visit: `http://localhost:3000/admin/login`
- Enter your password
- Start managing your site!

## Admin Panel Overview

### Dashboard (`/admin/dashboard`)
- View statistics (posts, images, requests, links)
- Quick access to all management areas

### Blog Management (`/admin/blog`)
- Add new blog posts
- Delete posts
- All posts displayed

### Gallery Management (`/admin/gallery`)
- Upload images with titles/descriptions
- Delete images
- Manage all gallery images

### Request Management (`/admin/requests`)
- View all commission requests
- Mark complete/incomplete
- Search by name/email
- Filter by status and type
- Delete requests
- View reference images uploaded by clients

### Links Management (`/admin/links`)
- Add useful links
- Delete links
- Links appear on public `/links` page

### Settings (`/admin/settings`)
- **Background Color**: Main page background
- **Header Background**: Header and sidebar color
- **Post Background**: Blog post card background
- **Text Color**: Main text color

## Public Site Features

### Gallery (`/gallery`)
- Clean image grid
- Click images for lightbox view
- No admin controls visible

### Blog (`/blogroll`)
- Read blog posts
- No add/edit controls for public

### Requests (`/requests`)
- Public commission request form
- Upload up to 5 reference images
- All fields captured

### Contact (`/contact`)
- Contact form
- No social media buttons
- Clean layout

## File Storage

### JSON Database
All data stored in `/data` folder:
- `posts.json` - Blog posts
- `gallery.json` - Gallery metadata
- `links.json` - Useful links
- `requests.json` - Commission requests
- `settings.json` - Color customization

### Uploaded Images
- Location: `/public/uploads/`
- Includes both gallery and request images

## Deployment

### DigitalOcean App Platform

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit v3.0"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Create App in DigitalOcean**
   - Apps → Create App
   - Connect GitHub repository
   - Select repository

3. **Set Environment Variables**
   In DigitalOcean dashboard:
   - `ADMIN_PASSWORD` = your-secure-password
   - `SESSION_SECRET` = random-32-character-string
   - `PORT` = 3000 (usually auto-set)

4. **Deploy**
   - Click Deploy
   - Wait 2-3 minutes
   - Access your site!

### Other Platforms

Same process works for:
- Railway.app
- Render.com
- Heroku
- Fly.io

Just set the environment variables in their dashboards.

## Security

### Password Protection
- Admin password in `.env` file
- Never commit `.env` to git (already in .gitignore)
- Change default password immediately

### Sessions
- 24-hour session timeout
- Secure cookie settings
- Session secret required

### HTTPS
- Automatically enabled on DigitalOcean, Railway, Render
- Required for production use

## Customization

### Colors
Use the Settings panel (`/admin/settings`) to change:
- Background colors
- Header colors
- Post card colors
- Text colors

### Content
Edit directly through admin panel:
- Blog posts
- Gallery images
- Links

### Code Changes
If you need to modify:
- `server.js` - Backend logic
- `public/style.css` - Additional styling
- `public/script.js` - Frontend behavior
- `views/` - Page templates

## Backup

### Important Files to Backup
```bash
# Backup data
tar -czf backup-$(date +%Y%m%d).tar.gz data/ public/uploads/
```

### Restore from Backup
```bash
tar -xzf backup-YYYYMMDD.tar.gz
```

## Troubleshooting

### Can't Login
- Check `.env` file exists
- Verify password is correct
- Clear browser cookies
- Restart server

### Images Not Uploading
```bash
# Ensure uploads directory exists
mkdir -p public/uploads
chmod 755 public/uploads
```

### Colors Not Changing
- Save settings in admin panel
- Refresh browser (Ctrl+F5)
- Check `data/settings.json` was updated

### Port Already in Use
```bash
PORT=8080 npm start
```

## Default Credentials

**Default admin password**: `admin123`

⚠️ **IMPORTANT**: Change this in `.env` immediately!

## Support

Check these files for help:
- `README.md` - Main documentation
- `SETUP_GUIDE.md` - This file
- `.env.example` - Environment variable template

## Version Info

**Version**: 3.0.0
**Release Date**: December 2025
**Node.js**: 14+ required

---

**You're all set!** 🎨

Start the server and visit `/admin/login` to begin managing your art portfolio.
