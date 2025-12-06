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
      <p style="font-size: 16px; color: #4a4a4a;">${slide.description}</p>
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

// Blog post form submission
const addPostForm = document.getElementById('addPostForm');
if (addPostForm) {
  addPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      title: document.getElementById('postTitle').value,
      content: document.getElementById('postContent').value,
      date: document.getElementById('postDate').value
    };

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
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

// Delete post
async function deletePost(id) {
  if (!confirm('Are you sure you want to delete this post?')) return;

  try {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      alert('Post deleted successfully!');
      window.location.reload();
    } else {
      alert('Error deleting post');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// Gallery image upload
const uploadImageForm = document.getElementById('uploadImageForm');
if (uploadImageForm) {
  uploadImageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', document.getElementById('imageTitle').value);
    formData.append('description', document.getElementById('imageDescription').value);
    formData.append('image', document.getElementById('imageFile').files[0]);

    try {
      const response = await fetch('/api/gallery', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('Image uploaded successfully!');
        window.location.reload();
      } else {
        alert('Error uploading image');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });
}

// Delete gallery image
async function deleteImage(id) {
  if (!confirm('Are you sure you want to delete this image?')) return;

  try {
    const response = await fetch(`/api/gallery/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      alert('Image deleted successfully!');
      window.location.reload();
    } else {
      alert('Error deleting image');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// Add link
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

// Contact form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const messageDiv = document.getElementById('contactMessage');
    messageDiv.style.display = 'block';
    messageDiv.innerHTML = 'Thank you for your message! I will get back to you within 2-3 business days.';
    
    contactForm.reset();
    
    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 5000);
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
        const messageDiv = document.getElementById('requestMessage');
        messageDiv.style.display = 'block';
        messageDiv.innerHTML = 'Your commission request has been submitted! I will review it and get back to you within 3-5 business days.';
        
        requestForm.reset();
        
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        alert('Error submitting request');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });
}

// Delete request
async function deleteRequest(id) {
  if (!confirm('Are you sure you want to delete this request?')) return;

  try {
    const response = await fetch(`/api/requests/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      alert('Request deleted successfully!');
      window.location.reload();
    } else {
      alert('Error deleting request');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// Gallery image modal (optional enhancement)
document.addEventListener('DOMContentLoaded', () => {
  const galleryItems = document.querySelectorAll('.gallery-item img');
  
  galleryItems.forEach(img => {
    img.addEventListener('click', (e) => {
      // Simple enlargement effect on click
      if (img.style.transform === 'scale(1.5)') {
        img.style.transform = 'scale(1)';
        img.style.position = 'relative';
        img.style.zIndex = '1';
      } else {
        img.style.transform = 'scale(1.5)';
        img.style.position = 'relative';
        img.style.zIndex = '1000';
        img.style.transition = 'transform 0.3s ease';
      }
    });
  });
});

// Set current date as default for blog post date
const postDateInput = document.getElementById('postDate');
if (postDateInput && !postDateInput.value) {
  const today = new Date().toISOString().split('T')[0];
  postDateInput.value = today;
}
