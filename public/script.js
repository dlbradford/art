// Carousel functionality for gallery images
let currentSlide = 0;
let carouselInterval = null;
let carouselPaused = false;

function updateCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  
  if (slides.length === 0) return;
  
  // Hide all slides
  slides.forEach((slide, index) => {
    slide.style.display = 'none';
    slide.classList.remove('active');
  });
  
  // Remove active from all dots
  dots.forEach(dot => dot.classList.remove('active'));
  
  // Show current slide
  if (slides[currentSlide]) {
    slides[currentSlide].style.display = 'block';
    slides[currentSlide].classList.add('active');
  }
  
  // Activate current dot
  if (dots[currentSlide]) {
    dots[currentSlide].classList.add('active');
  }
}

function nextSlide() {
  const slides = document.querySelectorAll('.carousel-slide');
  if (slides.length === 0) return;
  currentSlide = (currentSlide + 1) % slides.length;
  updateCarousel();
}

function prevSlide() {
  const slides = document.querySelectorAll('.carousel-slide');
  if (slides.length === 0) return;
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  updateCarousel();
}

function goToSlide(index) {
  const slides = document.querySelectorAll('.carousel-slide');
  if (slides.length === 0) return;
  currentSlide = index;
  updateCarousel();
}

function toggleCarouselPause() {
  carouselPaused = !carouselPaused;
  
  const pauseIcon = document.querySelector('.pause-icon');
  const playIcon = document.querySelector('.play-icon');
  
  if (carouselPaused) {
    pauseIcon.style.display = 'none';
    playIcon.style.display = 'inline';
    if (carouselInterval) {
      clearInterval(carouselInterval);
      carouselInterval = null;
    }
  } else {
    pauseIcon.style.display = 'inline';
    playIcon.style.display = 'none';
    startCarouselTimer();
  }
}

// Auto-advance carousel based on settings
function startCarouselTimer() {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;
  
  const slides = document.querySelectorAll('.carousel-slide');
  if (slides.length <= 1) return;
  
  // Clear any existing interval
  if (carouselInterval) {
    clearInterval(carouselInterval);
  }
  
  const timerSeconds = parseInt(carousel.dataset.timer) || 5;
  const timerMs = timerSeconds * 1000;
  
  carouselInterval = setInterval(() => {
    if (!carouselPaused && document.querySelectorAll('.carousel-slide').length > 1) {
      nextSlide();
    }
  }, timerMs);
}

// Apply responsive height to carousel images
function applyCarouselHeight() {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;
  
  const heightPercent = parseInt(carousel.dataset.height) || 25;
  const viewportHeight = window.innerHeight;
  const maxHeight = Math.floor(viewportHeight * (heightPercent / 100));
  
  const carouselImages = document.querySelectorAll('.carousel-image');
  carouselImages.forEach(img => {
    img.style.maxHeight = `${maxHeight}px`;
  });
}

// Start timer and apply height when page loads
function initCarousel() {
  applyCarouselHeight();
  startCarouselTimer();
}

// Update height on window resize
window.addEventListener('resize', applyCarouselHeight);

// Initialize carousel
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCarousel);
} else {
  initCarousel();
}

// Lightbox functionality
function openLightbox(imageSrc, title, description) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  
  if (lightbox && lightboxImg) {
    lightboxImg.src = imageSrc;
    if (lightboxTitle) lightboxTitle.textContent = title || '';
    if (lightboxDesc) lightboxDesc.textContent = description || '';
    lightbox.classList.add('active');
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
  }
}

// Close lightbox on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
  }
});

// Blog post form submission (Admin only)
const addPostForm = document.getElementById('addPostForm');
if (addPostForm) {
  // Show/hide image position options when file is selected
  const postImageInput = document.getElementById('postImage');
  const imagePositionGroup = document.getElementById('imagePositionGroup');
  
  if (postImageInput && imagePositionGroup) {
    postImageInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        imagePositionGroup.style.display = 'block';
      } else {
        imagePositionGroup.style.display = 'none';
      }
    });
  }

  addPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', document.getElementById('postTitle').value);
    formData.append('content', document.getElementById('postContent').value);
    formData.append('date', document.getElementById('postDate').value);
    
    // Add image if selected
    const imageFile = document.getElementById('postImage').files[0];
    if (imageFile) {
      formData.append('image', imageFile);
      const imagePosition = document.querySelector('input[name="imagePosition"]:checked').value;
      formData.append('imagePosition', imagePosition);
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('Post published successfully!');
        window.location.reload();
      } else {
        alert('Error publishing post');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });
}

// Delete post (Admin only)
async function deletePost(id) {
  if (!confirm('Are you sure you want to delete this post?')) return;

  try {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      showToast('Post deleted successfully!', 'success');
      // Reload after a brief delay to show toast
      setTimeout(() => window.location.reload(), 1000);
    } else {
      showToast('Error deleting post', 'error');
    }
  } catch (error) {
    showToast('Error: ' + error.message, 'error');
  }
}

// Edit blog post (Admin only)
function editPost(id) {
  const postElement = document.querySelector(`[data-post-id="${id}"]`);
  if (!postElement) return;
  
  const title = postElement.dataset.title;
  const date = postElement.dataset.date;
  const content = postElement.dataset.content.replace(/\\n/g, '\n');
  const image = postElement.dataset.image;
  const imagePosition = postElement.dataset.imagePosition || 'above';
  
  // Build edit form HTML
  const editFormHTML = `
    <div class="post-edit-form">
      <div class="form-group">
        <label>Title</label>
        <input type="text" id="edit-title-${id}" value="${title}" style="width: 100%; padding: 10px; border: 2px solid #0d6efd; border-radius: 6px; font-size: 16px; font-weight: 600;">
      </div>
      <div class="form-group">
        <label>Date</label>
        <input type="date" id="edit-date-${id}" value="${date}" style="width: 100%; padding: 10px; border: 2px solid #0d6efd; border-radius: 6px;">
      </div>
      <div class="form-group">
        <label>Content</label>
        <textarea id="edit-content-${id}" style="width: 100%; min-height: 200px; padding: 10px; border: 2px solid #0d6efd; border-radius: 6px; font-size: 14px; line-height: 1.6; resize: vertical;">${content}</textarea>
      </div>
      ${image ? `
        <div class="form-group">
          <label>Current Image</label>
          <div style="margin-bottom: 10px;">
            <img src="/uploads/${image}" alt="${title}" style="max-width: 300px; height: auto; border-radius: 6px; box-shadow: var(--shadow);">
          </div>
          <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 10px;">
            <label style="display: flex; align-items: center; font-weight: normal;">
              <input type="radio" name="edit-image-position-${id}" value="above" ${imagePosition === 'above' ? 'checked' : ''} style="margin-right: 6px;">
              Above text
            </label>
            <label style="display: flex; align-items: center; font-weight: normal;">
              <input type="radio" name="edit-image-position-${id}" value="below" ${imagePosition === 'below' ? 'checked' : ''} style="margin-right: 6px;">
              Below text
            </label>
          </div>
          <button type="button" onclick="removePostImage(${id})" class="btn-danger" style="font-size: 13px; padding: 6px 12px;">Remove Image</button>
        </div>
      ` : ''}
      <div class="form-group">
        <label>${image ? 'Replace' : 'Add'} Image (Optional)</label>
        <input type="file" id="edit-image-${id}" accept="image/*" style="width: 100%;">
        <div id="edit-image-position-group-${id}" style="display: ${image ? 'none' : 'none'}; margin-top: 10px;">
          <label>Image Position</label>
          <div style="display: flex; gap: 20px; margin-top: 8px;">
            <label style="display: flex; align-items: center; font-weight: normal;">
              <input type="radio" name="edit-new-image-position-${id}" value="above" checked style="margin-right: 6px;">
              Above text
            </label>
            <label style="display: flex; align-items: center; font-weight: normal;">
              <input type="radio" name="edit-new-image-position-${id}" value="below" style="margin-right: 6px;">
              Below text
            </label>
          </div>
        </div>
      </div>
      <div style="display: flex; gap: 10px; margin-top: 20px;">
        <button onclick="savePostEdit(${id})" class="btn-success" style="flex: 1;">Save Changes</button>
        <button onclick="cancelPostEdit(${id})" class="btn-secondary" style="flex: 1;">Cancel</button>
      </div>
    </div>
  `;
  
  // Replace post content with edit form
  postElement.innerHTML = editFormHTML;
  
  // Show position selector when new image is selected
  const imageInput = document.getElementById(`edit-image-${id}`);
  const positionGroup = document.getElementById(`edit-image-position-group-${id}`);
  imageInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      positionGroup.style.display = 'block';
    } else {
      positionGroup.style.display = 'none';
    }
  });
  
  // Focus on title
  document.getElementById(`edit-title-${id}`).focus();
}

// Save blog post edit
async function savePostEdit(id) {
  const title = document.getElementById(`edit-title-${id}`).value.trim();
  const date = document.getElementById(`edit-date-${id}`).value;
  const content = document.getElementById(`edit-content-${id}`).value.trim();
  const imageFile = document.getElementById(`edit-image-${id}`).files[0];
  
  if (!title || !date || !content) {
    showToast('Title, date, and content are required', 'error');
    return;
  }
  
  const formData = new FormData();
  formData.append('title', title);
  formData.append('date', date);
  formData.append('content', content);
  
  // Handle new image
  if (imageFile) {
    formData.append('image', imageFile);
    const newImagePosition = document.querySelector(`input[name="edit-new-image-position-${id}"]:checked`)?.value || 'above';
    formData.append('imagePosition', newImagePosition);
  } else {
    // Check if updating existing image position
    const existingImagePosition = document.querySelector(`input[name="edit-image-position-${id}"]:checked`)?.value;
    if (existingImagePosition) {
      formData.append('imagePosition', existingImagePosition);
    }
  }
  
  try {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'PATCH',
      body: formData
    });
    
    if (response.ok) {
      showToast('Post updated successfully!', 'success');
      setTimeout(() => window.location.reload(), 1000);
    } else {
      showToast('Error updating post', 'error');
    }
  } catch (error) {
    showToast('Error: ' + error.message, 'error');
  }
}

// Remove image from post
function removePostImage(id) {
  if (!confirm('Remove the image from this post?')) return;
  
  const formData = new FormData();
  const postElement = document.querySelector(`[data-post-id="${id}"]`);
  formData.append('title', postElement.dataset.title);
  formData.append('date', postElement.dataset.date);
  formData.append('content', postElement.dataset.content.replace(/\\n/g, '\n'));
  formData.append('removeImage', 'true');
  
  fetch(`/api/posts/${id}`, {
    method: 'PATCH',
    body: formData
  })
  .then(response => {
    if (response.ok) {
      showToast('Image removed successfully!', 'success');
      setTimeout(() => window.location.reload(), 1000);
    } else {
      showToast('Error removing image', 'error');
    }
  })
  .catch(error => {
    showToast('Error: ' + error.message, 'error');
  });
}

// Cancel blog post edit
function cancelPostEdit(id) {
  window.location.reload();
}

// Gallery image upload (Admin only)
const uploadImageForm = document.getElementById('uploadImageForm');
if (uploadImageForm) {
  uploadImageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Save values before clearing
    const title = document.getElementById('imageTitle').value;
    const description = document.getElementById('imageDescription').value;
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', document.getElementById('imageFile').files[0]);

    try {
      const response = await fetch('/api/gallery', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        
        // Clear the form for next upload
        document.getElementById('imageTitle').value = '';
        document.getElementById('imageDescription').value = '';
        document.getElementById('imageFile').value = '';
        
        // Add the new image to the gallery display
        const galleryGrid = document.querySelector('.gallery-grid');
        if (galleryGrid) {
          const newImageHTML = `
            <div class="gallery-item">
              <img src="/uploads/${result.filename}" alt="${title}">
              <div class="gallery-info">
                <div class="gallery-title">${title}</div>
                ${description ? `<div class="gallery-description">${description}</div>` : ''}
                <button onclick="deleteImage(${result.id})" class="btn-danger" style="margin-top: 10px; font-size: 12px;">Delete</button>
              </div>
            </div>
          `;
          galleryGrid.insertAdjacentHTML('afterbegin', newImageHTML);
        }
        
        alert('Image uploaded successfully! Form cleared for next upload.');
      } else {
        alert('Error uploading image');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });
}

// Delete gallery image (Admin only)
async function deleteImage(id) {
  // Try to show confirmation, but proceed even if browser blocks it
  try {
    const shouldDelete = confirm('Are you sure you want to delete this image?');
    if (shouldDelete === false) return; // Only return if user explicitly clicked Cancel
  } catch (e) {
    // If confirm is blocked, show a custom prompt
    const shouldDelete = window.confirm('Delete this image?');
    if (!shouldDelete) return;
  }

  try {
    const response = await fetch(`/api/gallery/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      // Remove the image from the page immediately instead of reloading
      const imageElement = document.querySelector(`button[onclick="deleteImage(${id})"]`)?.closest('.gallery-item');
      if (imageElement) {
        imageElement.style.transition = 'all 0.3s ease';
        imageElement.style.opacity = '0';
        imageElement.style.transform = 'scale(0.8)';
        setTimeout(() => imageElement.remove(), 300);
      }
      
      // Show success toast notification
      showToast('Image deleted successfully!', 'success');
    } else {
      showToast('Error deleting image', 'error');
    }
  } catch (error) {
    showToast('Error: ' + error.message, 'error');
  }
}

// Toggle carousel status for gallery image (Admin only)
async function toggleCarousel(id, inCarousel) {
  try {
    const response = await fetch(`/api/gallery/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inCarousel })
    });
    
    if (response.ok) {
      const message = inCarousel ? 'Added to carousel' : 'Removed from carousel';
      showToast(message, 'success');
    } else {
      showToast('Error updating carousel status', 'error');
      // Revert checkbox
      const checkbox = document.querySelector(`input[onchange*="toggleCarousel(${id}"]`);
      if (checkbox) checkbox.checked = !inCarousel;
    }
  } catch (error) {
    showToast('Error: ' + error.message, 'error');
    // Revert checkbox
    const checkbox = document.querySelector(`input[onchange*="toggleCarousel(${id}"]`);
    if (checkbox) checkbox.checked = !inCarousel;
  }
}

// Edit gallery image (Admin only)
function editImage(id) {
  const galleryItem = document.querySelector(`[data-image-id="${id}"]`);
  if (!galleryItem) return;
  
  const titleElement = galleryItem.querySelector('[data-field="title"]');
  const descElement = galleryItem.querySelector('[data-field="description"]');
  
  const currentTitle = titleElement.textContent;
  const currentDesc = descElement.textContent === 'No description' ? '' : descElement.textContent;
  
  // Replace with input fields
  titleElement.innerHTML = `<input type="text" value="${currentTitle}" id="edit-title-${id}" style="width: 100%; padding: 6px; border: 2px solid #0d6efd; border-radius: 4px; font-size: 14px; font-weight: 600;">`;
  descElement.innerHTML = `<textarea id="edit-desc-${id}" style="width: 100%; padding: 6px; border: 2px solid #0d6efd; border-radius: 4px; font-size: 13px; min-height: 60px; resize: vertical;">${currentDesc}</textarea>`;
  
  // Replace buttons
  const buttonContainer = galleryItem.querySelector('div[style*="display: flex"]');
  buttonContainer.innerHTML = `
    <button onclick="saveImageEdit(${id})" class="btn-success" style="flex: 1; font-size: 12px;">Save</button>
    <button onclick="cancelImageEdit(${id}, '${currentTitle.replace(/'/g, "\\'")}', '${currentDesc.replace(/'/g, "\\'")}', '${currentDesc ? 'false' : 'true'}')" class="btn-secondary" style="flex: 1; font-size: 12px;">Cancel</button>
  `;
  
  // Focus on title input
  document.getElementById(`edit-title-${id}`).focus();
}

// Save image edit
async function saveImageEdit(id) {
  const newTitle = document.getElementById(`edit-title-${id}`).value.trim();
  const newDesc = document.getElementById(`edit-desc-${id}`).value.trim();
  
  if (!newTitle) {
    showToast('Title cannot be empty', 'error');
    return;
  }
  
  try {
    const response = await fetch(`/api/gallery/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, description: newDesc })
    });
    
    if (response.ok) {
      const galleryItem = document.querySelector(`[data-image-id="${id}"]`);
      const titleElement = galleryItem.querySelector('[data-field="title"]');
      const descElement = galleryItem.querySelector('[data-field="description"]');
      
      // Update display
      titleElement.textContent = newTitle;
      descElement.textContent = newDesc || 'No description';
      if (!newDesc) {
        descElement.style.color = '#999';
        descElement.style.fontStyle = 'italic';
      } else {
        descElement.style.color = '';
        descElement.style.fontStyle = '';
      }
      
      // Restore buttons
      const buttonContainer = galleryItem.querySelector('div[style*="display: flex"]');
      buttonContainer.innerHTML = `
        <button onclick="editImage(${id})" class="btn-edit" style="flex: 1; font-size: 12px;">Edit</button>
        <button onclick="deleteImage(${id})" class="btn-danger" style="flex: 1; font-size: 12px;">Delete</button>
      `;
      
      showToast('Image updated successfully!', 'success');
    } else {
      showToast('Error updating image', 'error');
    }
  } catch (error) {
    showToast('Error: ' + error.message, 'error');
  }
}

// Cancel image edit
function cancelImageEdit(id, originalTitle, originalDesc, wasEmpty) {
  const galleryItem = document.querySelector(`[data-image-id="${id}"]`);
  const titleElement = galleryItem.querySelector('[data-field="title"]');
  const descElement = galleryItem.querySelector('[data-field="description"]');
  
  // Restore original values
  titleElement.textContent = originalTitle;
  if (wasEmpty === 'true') {
    descElement.textContent = 'No description';
    descElement.style.color = '#999';
    descElement.style.fontStyle = 'italic';
  } else {
    descElement.textContent = originalDesc;
    descElement.style.color = '';
    descElement.style.fontStyle = '';
  }
  
  // Restore buttons
  const buttonContainer = galleryItem.querySelector('div[style*="display: flex"]');
  buttonContainer.innerHTML = `
    <button onclick="editImage(${id})" class="btn-edit" style="flex: 1; font-size: 12px;">Edit</button>
    <button onclick="deleteImage(${id})" class="btn-danger" style="flex: 1; font-size: 12px;">Delete</button>
  `;
}

// Helper function for toast notifications
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.textContent = message;
  const bgColor = type === 'success' ? '#198754' : type === 'error' ? '#dc3545' : '#0d6efd';
  toast.style.cssText = `position:fixed;top:20px;right:20px;background:${bgColor};color:white;padding:15px 25px;border-radius:6px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.15);font-size:14px;font-weight:500;animation:slideIn 0.3s ease;`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add link (Admin only)
const addLinkForm = document.getElementById('addLinkForm');
if (addLinkForm) {
  addLinkForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      title: document.getElementById('linkTitle').value,
      url: document.getElementById('linkUrl').value,
      description: document.getElementById('linkDescription').value
    };

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Link added successfully!');
        window.location.reload();
      } else {
        alert('Error adding link');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });
}

// Delete link (Admin only)
async function deleteLink(id) {
  if (!confirm('Are you sure you want to delete this link?')) return;

  try {
    const response = await fetch(`/api/links/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      showToast('Link deleted successfully!', 'success');
      setTimeout(() => window.location.reload(), 1000);
    } else {
      showToast('Error deleting link', 'error');
    }
  } catch (error) {
    showToast('Error: ' + error.message, 'error');
  }
}

// Contact form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    alert('Thank you for your message! I will get back to you within 2-3 business days.');
    contactForm.reset();
  });
}

// Request form
const requestForm = document.getElementById('requestForm');
if (requestForm) {
  requestForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', document.getElementById('requestName').value);
    formData.append('email', document.getElementById('requestEmail').value);
    formData.append('type', document.getElementById('requestType').value);
    formData.append('size', document.getElementById('requestSize').value);
    formData.append('budget', document.getElementById('requestBudget').value);
    formData.append('description', document.getElementById('requestDescription').value);
    formData.append('timeline', document.getElementById('requestTimeline').value);
    
    // Add image files
    const imageFiles = document.getElementById('requestImages').files;
    for (let i = 0; i < Math.min(imageFiles.length, 5); i++) {
      formData.append('images', imageFiles[i]);
    }
    
    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('Your commission request has been submitted! I will review it and get back to you within 3-5 business days.');
        requestForm.reset();
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        alert('Error submitting request');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });
}

// Update request status (Admin only)
async function updateRequestStatus(id, status) {
  try {
    const response = await fetch(`/api/requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    if (response.ok) {
      alert('Request status updated!');
      window.location.reload();
    } else {
      alert('Error updating status');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// Delete request (Admin only)
async function deleteRequest(id) {
  if (!confirm('Are you sure you want to delete this request?')) return;

  try {
    const response = await fetch(`/api/requests/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      showToast('Request deleted successfully!', 'success');
      setTimeout(() => window.location.reload(), 1000);
    } else {
      showToast('Error deleting request', 'error');
    }
  } catch (error) {
    showToast('Error: ' + error.message, 'error');
  }
}

// Settings form (Admin only)
const settingsForm = document.getElementById('settingsForm');
if (settingsForm) {
  settingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const carouselTimer = parseInt(document.getElementById('carouselTimer').value);
    const carouselHeight = parseInt(document.getElementById('carouselHeightInput').value);
    
    const formData = {
      backgroundColor: document.getElementById('backgroundColor').value,
      postBackground: document.getElementById('postBackground').value,
      textColor: document.getElementById('textColor').value,
      carouselTimer: carouselTimer >= 3 && carouselTimer <= 30 ? carouselTimer : 5,
      carouselHeight: carouselHeight >= 10 && carouselHeight <= 90 ? carouselHeight : 25
    };

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Settings saved! Refresh to see changes.');
        window.location.reload();
      } else {
        alert('Error saving settings');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });
}

// About page edit form (Admin only)
const aboutForm = document.getElementById('aboutForm');
if (aboutForm && window.location.pathname.includes('/admin/about/edit')) {
  aboutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get content from TinyMCE
    const formData = {
      fullContent: tinymce.get('pageContent').getContent()
    };

    try {
      const response = await fetch('/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showToast('About page updated successfully!', 'success');
        setTimeout(() => window.location.href = '/about', 1500);
      } else {
        showToast('Error saving About page', 'error');
      }
    } catch (error) {
      showToast('Error: ' + error.message, 'error');
    }
  });
}

// Contact page edit form (Admin only)
const contactFormEdit = document.getElementById('contactForm');
if (contactFormEdit && window.location.pathname.includes('/admin/contact/edit')) {
  contactFormEdit.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get content from TinyMCE
    const formData = {
      fullContent: tinymce.get('pageContent').getContent()
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showToast('Contact page updated successfully!', 'success');
        setTimeout(() => window.location.href = '/contact', 1500);
      } else {
        showToast('Error saving Contact page', 'error');
      }
    } catch (error) {
      showToast('Error: ' + error.message, 'error');
    }
  });
}

// Request search and filter (Admin only)
function filterRequests() {
  const searchTerm = document.getElementById('searchRequests')?.value.toLowerCase() || '';
  const statusFilter = document.getElementById('filterStatus')?.value || 'all';
  const typeFilter = document.getElementById('filterType')?.value || 'all';
  
  const requests = document.querySelectorAll('.request-item');
  
  requests.forEach(request => {
    const name = request.getAttribute('data-name')?.toLowerCase() || '';
    const email = request.getAttribute('data-email')?.toLowerCase() || '';
    const status = request.getAttribute('data-status') || '';
    const type = request.getAttribute('data-type') || '';
    
    const matchesSearch = name.includes(searchTerm) || email.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    const matchesType = typeFilter === 'all' || type === typeFilter;
    
    if (matchesSearch && matchesStatus && matchesType) {
      request.style.display = 'block';
    } else {
      request.style.display = 'none';
    }
  });
}

// Set current date as default for blog post date
const postDateInput = document.getElementById('postDate');
if (postDateInput && !postDateInput.value) {
  const today = new Date().toISOString().split('T')[0];
  postDateInput.value = today;
}

// Apply custom colors from settings
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const bg = body.getAttribute('data-bg-color');
  const headerBg = body.getAttribute('data-header-bg');
  const postBg = body.getAttribute('data-post-bg');
  const textColor = body.getAttribute('data-text-color');
  
  if (bg) {
    document.documentElement.style.setProperty('--primary-bg', bg);
  }
  if (headerBg) {
    document.documentElement.style.setProperty('--secondary-bg', headerBg);
  }
  if (postBg) {
    const posts = document.querySelectorAll('.post');
    posts.forEach(post => {
      post.style.backgroundColor = postBg;
    });
  }
  if (textColor) {
    document.documentElement.style.setProperty('--primary-text', textColor);
  }
});
