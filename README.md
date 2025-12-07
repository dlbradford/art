# Art Portfolio Website v3.0

## New Features in v3.0

### Admin Panel
- **Password-protected admin access** - Simple password authentication
- **Admin Dashboard** - Overview of all content with statistics
- **Blog Management** - Add/delete posts from admin panel
- **Gallery Management** - Upload/delete images from admin panel
- **Request Management** - Track commission requests, mark complete/incomplete, search and filter
- **Links Management** - Add/delete useful links from admin panel
- **Settings Panel** - Customize colors (background, header, posts, text) with color pickers

### Public Site Improvements
- **Gallery with Lightbox** - Click images to view in large format
- **No admin controls on public pages** - Clean interface for visitors
- **Commission requests** - Public form with image uploads
- **Customizable styling** - All colors managed through admin settings

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Admin Password
Create a `.env` file:
```bash
cp .env.example .env
```

Edit `.env` and change the password:
```
ADMIN_PASSWORD=your-secure-password-here
SESSION_SECRET=your-random-secret-key-here
```

### 3. Run the Server
```bash
npm start
```

Visit: `http://localhost:3000`

### 4. Access Admin Panel
1. Go to: `http://localhost:3000/admin/login`
2. Enter your password
3. Manage your site from `/admin/dashboard`

## Admin Features

### Blog Management (`/admin/blog`)
- Add new blog posts
- Delete existing posts
- View all posts

### Gallery Management (`/admin/gallery`)
- Upload images with titles and descriptions
- Delete images
- View all gallery images

### Request Management (`/admin/requests`)
- View all commission requests
- Mark requests as complete/incomplete
- Search by name, email
- Filter by status and type
- Delete requests

### Links Management (`/admin/links`)
- Add useful links
- Delete links
- Links appear on public Links page

### Settings (`/admin/settings`)
- **Background Color** - Main page background
- **Header Background** - Header and sidebar color
- **Post Background** - Blog post card background
- **Text Color** - Main text color

Use color pickers to customize instantly!

## File Structure

```
donna-art-site/
├── server.js              # Main application with admin routes
├── package.json           # Dependencies
├── .env.example           # Environment variables template
├── data/                  # JSON database
│   ├── posts.json        # Blog posts
│   ├── gallery.json      # Gallery images metadata
│   ├── links.json        # Useful links
│   ├── requests.json     # Commission requests
│   └── settings.json     # Site color settings
├── public/               # Static files
│   ├── style.css         # Styles (no header shadow)
│   ├── script.js         # Client-side JavaScript with lightbox
│   └── uploads/          # Uploaded images
└── views/                # EJS templates
    ├── layout.ejs        # Main layout with customizable colors
    ├── index.ejs         # Home page
    ├── blogroll.ejs      # Blog (no admin controls)
    ├── gallery.ejs       # Gallery with lightbox
    ├── requests.ejs      # Commission request form
    ├── links.ejs         # Links display
    ├── contact.ejs       # Contact (no social media buttons)
    ├── about.ejs         # About page
    └── admin/            # Admin templates
        ├── login.ejs     # Admin login
        ├── dashboard.ejs # Admin dashboard
        ├── blog.ejs      # Blog management
        ├── gallery.ejs   # Gallery management
        ├── requests.ejs  # Request management
        ├── links.ejs     # Links management
        └── settings.ejs  # Color settings
```

## Requirements Met

✅ Gallery page shows only images (no upload form)
✅ Lightbox for viewing large images
✅ Blog add/edit only for logged-in admin
✅ Admin section for managing everything
✅ No delete buttons on public pages
✅ CSS color customization through admin panel
✅ Header has no shadow
✅ Upload image section in admin only
✅ Request tracking (complete/incomplete)
✅ Request search and filter
✅ Links input in admin section only
✅ No social media buttons on contact page

## Default Admin Password

**Default password**: `admin123`

⚠️ **IMPORTANT**: Change this immediately in your `.env` file!

## Deployment

### DigitalOcean App Platform

1. Push code to GitHub
2. Create new App in DigitalOcean
3. Connect to repository
4. Add environment variables:
   - `ADMIN_PASSWORD`: your password
   - `SESSION_SECRET`: random string
5. Deploy!

### Environment Variables for Production

Set these in your hosting platform:
```
ADMIN_PASSWORD=your-secure-password
SESSION_SECRET=random-secret-key-min-32-characters
PORT=3000
```

## Security Notes

- Admin password is stored in environment variables
- Sessions expire after 24 hours
- Use HTTPS in production (auto-enabled on most platforms)
- Change default password immediately
- Keep `.env` file out of version control (already in .gitignore)

## Support

For issues or questions, check the documentation or consult the deployment guides.

---

**Version**: 3.0.0
**Built for**: Donna McAdams Art Portfolio
