// Gallery App - Image slideshow with prev/next navigation
const images = [
  { url: 'https://picsum.photos/seed/1/600/400', caption: 'Mountain Landscape' },
  { url: 'https://picsum.photos/seed/2/600/400', caption: 'Ocean Sunset' },
  { url: 'https://picsum.photos/seed/3/600/400', caption: 'Forest Path' },
  { url: 'https://picsum.photos/seed/4/600/400', caption: 'City Skyline' },
  { url: 'https://picsum.photos/seed/5/600/400', caption: 'Desert Dunes' }
];

let currentIndex = 0;

const galleryImage = document.getElementById('galleryImage');
const caption = document.getElementById('caption');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function updateGallery() {
  const image = images[currentIndex];
  galleryImage.src = image.url;
  galleryImage.alt = image.caption;
  caption.textContent = `${image.caption} (${currentIndex + 1} of ${images.length})`;
}

prevBtn.addEventListener('click', function() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateGallery();
});

nextBtn.addEventListener('click', function() {
  currentIndex = (currentIndex + 1) % images.length;
  updateGallery();
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowLeft') {
    prevBtn.click();
  } else if (e.key === 'ArrowRight') {
    nextBtn.click();
  }
});

// Initial update
updateGallery();
