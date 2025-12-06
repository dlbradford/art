# Quick Git Commands

## Setup (One Time Only)

```bash
# Extract website
tar -xzf donna-art-site-v2.tar.gz
cd donna-art-site

# Initialize Git
git init
git add .
git commit -m "Initial commit - Art portfolio website v2.0"

# Connect to your Git server
git remote add origin YOUR_GIT_URL
git push -u origin main
```

**Replace `YOUR_GIT_URL` with one of:**
- GitHub: `https://github.com/USERNAME/donna-art-portfolio.git`
- GitLab: `https://gitlab.com/USERNAME/donna-art-portfolio.git`
- Self-hosted: `https://your-server.com/USERNAME/donna-art-portfolio.git`

## Daily Commands

```bash
# See what changed
git status

# Add all changes
git add .

# Commit with message
git commit -m "Your descriptive message here"

# Push to remote
git push
```

## Pull Before You Push

```bash
# Get latest changes from remote
git pull

# Make your changes
git add .
git commit -m "Update gallery"

# Push your changes
git push
```

## Common Tasks

```bash
# Add new blog post
git add data/posts.json
git commit -m "Add new blog post"
git push

# Update styling
git add public/style.css
git commit -m "Update colors"
git push

# Update multiple files
git add .
git commit -m "Update About page and add images"
git push
```

## Check Your Work

```bash
# See what's changed
git status

# See detailed changes
git diff

# View commit history
git log --oneline

# See remote URL
git remote -v
```

## Undo Mistakes

```bash
# Undo changes to a file (before commit)
git checkout -- filename

# Unstage a file
git reset HEAD filename

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes - careful!)
git reset --hard HEAD~1
```

## SSH vs HTTPS

**HTTPS** (easier, requires password):
```bash
git remote add origin https://github.com/USERNAME/repo.git
```

**SSH** (more secure, no password after setup):
```bash
git remote add origin git@github.com:USERNAME/repo.git
```

To switch from HTTPS to SSH:
```bash
git remote set-url origin git@github.com:USERNAME/repo.git
```

## That's It!

Most of the time you'll just use:
```bash
git add .
git commit -m "What you changed"
git push
```
