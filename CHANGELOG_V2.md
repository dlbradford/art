# Changelog - Version 2.0

## Major Changes

### Design Overhaul
✅ **Removed browser mockup styling** - No more faux address bar with dots
✅ **Modern, clean design** - Professional contemporary web design
✅ **Updated color scheme** - Clean whites, modern blues, proper shadows
✅ **Better typography** - System fonts for readability
✅ **Improved spacing and layout** - More breathing room, better visual hierarchy

### New Features
✅ **Commission Requests with Images** - Clients can now upload up to 5 reference images
✅ **Request Management System** - View all submitted requests with images
✅ **Status Tracking** - Requests show pending/completed status
✅ **Image Gallery for Requests** - Reference images displayed in a grid

### Technical Improvements
✅ **Multi-file upload support** - Using Multer for handling multiple images
✅ **Request database** - JSON file storage for commission requests
✅ **Image deletion** - Properly removes associated images when deleting requests
✅ **Better form handling** - FormData for file uploads

## Design Changes

### Header
- **Before**: Faux browser window with dots and URL bar
- **After**: Clean header with just "Art by Donna" title

### Navigation
- **Before**: Brutalist black borders
- **After**: Modern sidebar with hover states and active indicators

### Color Palette
- **Before**: Off-white background (#fefef8), black borders
- **After**: Pure white (#ffffff), modern blue accent (#0d6efd), subtle shadows

### Typography
- **Before**: Courier New monospace throughout
- **After**: System font stack (San Francisco, Segoe UI, etc.)

### Components
- **Buttons**: Rounded corners, blue background, smooth hover effects
- **Forms**: Modern inputs with focus states, better spacing
- **Cards**: Subtle shadows, rounded corners, clean borders
- **Images**: Proper aspect ratios, rounded corners

## Commission Requests Page

### New Capabilities
1. **Image Upload Field**
   - Upload up to 5 reference images
   - Visual feedback area with dashed border
   - Helper text explaining purpose

2. **Request Display**
   - All submitted requests shown below form
   - Status badges (pending/completed)
   - Reference images in responsive grid
   - Delete functionality for each request

3. **Data Stored**
   - Name, email, type, size, budget
   - Description, timeline
   - Array of image filenames
   - Submission timestamp
   - Status field

## File Structure Changes

### New Files
- `data/requests.json` - Stores commission request data

### Modified Files
- `server.js` - Added requests API endpoints
- `public/style.css` - Complete design overhaul
- `views/layout.ejs` - Removed browser mockup
- `views/requests.ejs` - Image upload and request display
- `public/script.js` - Request form with file upload

## API Endpoints Added

### POST /api/requests
- Accepts multipart/form-data
- Handles up to 5 image files
- Creates request with associated images

### DELETE /api/requests/:id
- Deletes request from database
- Removes associated image files from disk

## CSS Variables Updated

```css
/* Old */
--primary-bg: #fefef8;
--border-color: #2a2a2a;
--accent-color: #4a4a4a;

/* New */
--primary-bg: #ffffff;
--border-color: #dee2e6;
--accent-color: #0d6efd;
```

## Responsive Design

- Sidebar collapses to horizontal navigation on mobile
- Gallery grid adjusts from 4 columns to 2 on mobile
- Request image grid adapts for smaller screens
- Touch-friendly button sizes

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Migration from v1.0

If you're updating from version 1.0:

1. Extract the new archive
2. Your existing data files will be preserved
3. New `requests.json` will be created automatically
4. No database migration needed

## What Stayed the Same

✅ JSON file-based storage
✅ No external database required
✅ All 7 pages functional
✅ Blog, gallery, links systems unchanged
✅ Easy deployment to any platform
✅ Sample data included

## Breaking Changes

⚠️ **Visual Design** - If you customized colors, you'll need to update CSS variables
⚠️ **Layout Structure** - Header HTML changed (browser mockup removed)

## Known Issues

None currently identified.

## Future Enhancements

Potential features for v3.0:
- Request status updates (in progress, completed)
- Email notifications for new requests
- Request categories/tags
- Admin authentication
- Image compression/optimization
- Request search and filtering

## Performance

- Faster page loads (less CSS complexity)
- Better mobile performance
- Optimized animations
- Reduced layout shifts

## Accessibility

- Better contrast ratios
- Focus states on all interactive elements
- Semantic HTML maintained
- Keyboard navigation improved

## Version Summary

**v1.0**: Brutalist design with browser mockup, basic forms
**v2.0**: Modern design, image uploads for requests, better UX

---

**Released**: December 6, 2025
**Archive**: donna-art-site-v2.tar.gz
