// Carousel functionality
let currentSlide = 0;
const slides = [
  {
    title: "Welcome to My Art Portfolio",
    description: "Exploring color, form, and expression through mixed media"
  },
  {
    title: "New Collection Available",
    description: "Discover my latest series of abstract landscapes"
  },
  {
    title: "Commission Work Accepted",
    description: "Let's create something unique together"
  }
];

function updateCarousel() {
  const carouselContent = document.querySelector('.carousel-content');
  if (carouselContent) {
    const slide = slides[currentSlide];
    carouselContent.innerHTML = `
      <h2 style="font-size: 28px; margin-bottom: 15px;">${slide.title}</h2>
      <p style="font-size: 16px;">${slide.description}</p>
    `;
  }
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  updateCarousel();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  updateCarousel();
}

// Auto-advance carousel
setInterval(nextSlide, 5000);

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
    
    const formData = {
      backgroundColor: document.getElementById('backgroundColor').value,
      postBackground: document.getElementById('postBackground').value,
      textColor: document.getElementById('textColor').value
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
