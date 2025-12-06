# Git Setup Guide

## Quick Setup (5 minutes)

### Step 1: Extract and Navigate to Project

```bash
tar -xzf donna-art-site-v2.tar.gz
cd donna-art-site
```

### Step 2: Initialize Git Repository

```bash
# Initialize git
git init

# Add all files
git add .

# Make your first commit
git commit -m "Initial commit - Art portfolio website v2.0"
```

### Step 3: Connect to Your Git Instance

Replace `YOUR_GIT_URL` with your actual Git repository URL:

```bash
# Add your remote repository
git remote add origin YOUR_GIT_URL

# Push to your repository
git push -u origin main
```

If your default branch is `master` instead of `main`:
```bash
git branch -M main  # Rename to main if needed
# OR
git push -u origin master  # If using master
```

---

## Detailed Instructions

### For GitHub

1. **Create Repository on GitHub**
   - Go to https://github.com/new
   - Name: `donna-art-portfolio` (or your choice)
   - Don't initialize with README (we already have one)
   - Click "Create repository"

2. **Connect and Push**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/donna-art-portfolio.git
   git branch -M main
   git push -u origin main
   ```

### For GitLab

1. **Create Repository on GitLab**
   - Go to your GitLab instance
   - Click "New project"
   - Name: `donna-art-portfolio`
   - Don't initialize with README
   - Click "Create project"

2. **Connect and Push**
   ```bash
   git remote add origin https://gitlab.com/YOUR_USERNAME/donna-art-portfolio.git
   git branch -M main
   git push -u origin main
   ```

### For Self-Hosted Git (Gitea, GitLab, etc.)

1. **Create Repository on Your Instance**
   - Navigate to your Git instance
   - Create new repository
   - Note the repository URL

2. **Connect and Push**
   ```bash
   git remote add origin https://your-git-instance.com/YOUR_USERNAME/donna-art-portfolio.git
   git branch -M main
   git push -u origin main
   ```

### For SSH Instead of HTTPS

If you prefer SSH (more secure, no password prompts):

```bash
# GitHub
git remote add origin git@github.com:YOUR_USERNAME/donna-art-portfolio.git

# GitLab
git remote add origin git@gitlab.com:YOUR_USERNAME/donna-art-portfolio.git

# Self-hosted
git remote add origin git@your-git-instance.com:YOUR_USERNAME/donna-art-portfolio.git

# Push
git push -u origin main
```

---

## .gitignore Configuration

The project already includes a `.gitignore` file that excludes:

```
# Dependencies
node_modules/

# Data files (optional - see note below)
# data/

# Uploads (optional - see note below)
public/uploads/*
!public/uploads/.gitkeep

# Environment variables
.env

# Logs
*.log

# OS files
.DS_Store
```

### Should You Commit Data Files?

**Option 1: Commit Data (Recommended for personal projects)**
- Keep `data/` folder commented out in `.gitignore`
- Your blog posts, gallery metadata, etc. will be version controlled
- Easy to sync across machines
- Backup built-in

**Option 2: Don't Commit Data**
- Uncomment `data/` in `.gitignore`
- Manually backup your data folder
- More flexibility for production vs. development data

**Option 3: Don't Commit Uploads**
- Keep `public/uploads/*` in `.gitignore`
- Use cloud storage (S3, Cloudinary) for images in production
- Smaller repository size

---

## Git Workflow

### Making Changes

```bash
# Check what changed
git status

# Add specific files
git add file1.js file2.css

# Or add all changes
git add .

# Commit with message
git commit -m "Add new blog post"

# Push to remote
git push
```

### Update Blog Content

```bash
# Edit data/posts.json directly or use the web interface
# Then commit the changes
git add data/posts.json
git commit -m "Add new blog post about recent artwork"
git push
```

### Update Styling

```bash
# Edit public/style.css
git add public/style.css
git commit -m "Update color scheme"
git push
```

---

## Branch Strategy

### Simple Strategy (Recommended for Solo Projects)

Just use `main` branch:
```bash
# Make changes
git add .
git commit -m "Update about page"
git push
```

### Feature Branch Strategy (For Collaboration)

```bash
# Create new feature branch
git checkout -b feature/new-gallery-layout

# Make changes
git add .
git commit -m "Redesign gallery layout"

# Push feature branch
git push -u origin feature/new-gallery-layout

# Merge to main (after testing)
git checkout main
git merge feature/new-gallery-layout
git push
```

---

## Deployment from Git

### Automatic Deployment (Recommended)

Most hosting platforms support automatic deployment from Git:

**Render.com:**
1. Connect GitHub/GitLab account
2. Select repository
3. Auto-deploys on every push to main

**Railway.app:**
1. Connect repository
2. Auto-detects Node.js
3. Deploys automatically

**Vercel/Netlify:**
1. Import Git repository
2. Configure build settings
3. Auto-deploy enabled

### Manual Deployment

On your server:
```bash
# First time
git clone YOUR_GIT_URL
cd donna-art-site
npm install
npm start

# Updates
git pull
npm install  # If package.json changed
pm2 restart donna-site  # Or restart your process
```

---

## Useful Git Commands

### Check Status
```bash
git status                    # See what changed
git log                       # View commit history
git log --oneline            # Compact commit history
```

### Undo Changes
```bash
git checkout -- file.js      # Undo changes to file
git reset HEAD file.js       # Unstage file
git reset --hard HEAD        # Discard all changes (careful!)
```

### View Changes
```bash
git diff                     # See unstaged changes
git diff --staged            # See staged changes
git diff main..branch-name   # Compare branches
```

### Remote Management
```bash
git remote -v                # View remote URLs
git remote set-url origin URL # Change remote URL
git fetch                    # Download remote changes
git pull                     # Fetch and merge
```

### Tagging Releases
```bash
git tag v2.0.0              # Create tag
git push --tags             # Push tags to remote
git tag -a v2.0.0 -m "Version 2.0 release"  # Annotated tag
```

---

## Collaboration Workflow

If working with others:

```bash
# Always pull before making changes
git pull

# Make your changes
git add .
git commit -m "Your changes"

# Pull again (in case others pushed)
git pull

# Push your changes
git push
```

---

## Backup Strategy

### Local Backups
```bash
# Create backup branch
git branch backup-$(date +%Y%m%d)

# Or export as archive
git archive -o backup.zip HEAD
```

### Remote Backups
- Your Git repository IS your backup
- Consider multiple remotes:
  ```bash
  git remote add backup git@backup-server.com:donna-site.git
  git push backup main
  ```

---

## Common Issues & Solutions

### Issue: "Permission denied (publickey)"
**Solution:** Set up SSH keys or use HTTPS instead

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key and add to Git service
cat ~/.ssh/id_ed25519.pub
```

### Issue: "Failed to push - rejected"
**Solution:** Pull first, then push

```bash
git pull --rebase
git push
```

### Issue: "Merge conflict"
**Solution:** Resolve conflicts manually

```bash
# Git will mark conflicts in files
# Edit files to resolve
git add resolved-file.js
git commit -m "Resolve merge conflict"
git push
```

### Issue: "Large files rejected"
**Solution:** Use Git LFS for large files

```bash
# Install Git LFS
git lfs install

# Track large files
git lfs track "*.psd"
git lfs track "public/uploads/*.jpg"

# Commit
git add .gitattributes
git commit -m "Add Git LFS tracking"
git push
```

---

## GitHub Actions (CI/CD)

Example workflow file (`.github/workflows/deploy.yml`):

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test  # If you have tests
      # Add deployment steps here
```

---

## Security Best Practices

### Never Commit Sensitive Data
```bash
# Check for secrets before committing
git diff

# If you accidentally committed secrets:
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/secret/file" \
  --prune-empty --tag-name-filter cat -- --all
```

### Use Environment Variables
```bash
# Create .env file (already in .gitignore)
echo "DATABASE_URL=your_secret" > .env
echo "API_KEY=your_key" >> .env

# Never commit .env file
```

### Review Changes Before Committing
```bash
git diff                 # Review changes
git add -p              # Add chunks interactively
git commit              # Write good commit message
```

---

## Commit Message Guidelines

Good commit messages:
```bash
git commit -m "Add image upload to commission requests"
git commit -m "Fix navigation active state on mobile"
git commit -m "Update README with deployment instructions"
git commit -m "Refactor gallery component for better performance"
```

Bad commit messages:
```bash
git commit -m "update"
git commit -m "fix"
git commit -m "asdf"
git commit -m "done"
```

---

## Quick Reference Card

```bash
# Setup
git init
git remote add origin URL
git push -u origin main

# Daily workflow
git pull                    # Get latest
git add .                   # Stage changes
git commit -m "message"     # Commit
git push                    # Push to remote

# Check status
git status
git log --oneline

# Undo
git checkout -- file        # Discard changes
git reset HEAD file         # Unstage
git revert COMMIT           # Undo commit

# Branches
git branch feature          # Create branch
git checkout feature        # Switch to branch
git merge feature           # Merge branch
```

---

## Next Steps

1. ✅ Extract your website files
2. ✅ Initialize Git repository
3. ✅ Make initial commit
4. ✅ Create remote repository
5. ✅ Connect and push
6. ✅ Set up automatic deployment (optional)
7. ✅ Make changes and commit regularly

Your code is now safely version controlled! 🎉
