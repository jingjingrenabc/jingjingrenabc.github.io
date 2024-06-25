// Get the modal
var modal = document.getElementById("modal");

// Get the image and insert it inside the modal - use its "alt" text as a caption
var modalImg = document.getElementById("modal-img");
var captionText = document.getElementById("caption");
var resolutionText = document.getElementById("resolution");

var images = document.querySelectorAll('.gallery-item img');
var thumbnailsContainer = document.querySelector('.thumbnails');
var currentIndex = 0;

images.forEach((img, index) => {
    var thumbnail = img.cloneNode(true);
    thumbnail.classList.remove('gallery-image');
    thumbnail.classList.add('thumbnail');
    thumbnailsContainer.appendChild(thumbnail);

    img.onclick = function () {
        openModal(index);
    }

    thumbnail.onclick = function () {
        openModal(index);
    }
});

function openModal(index) {
    currentIndex = index;
    modal.style.display = "block";
    updateModalContent();
}

function closeModal() {
    modal.style.display = "none";
}

function updateModalContent() {
    var img = images[currentIndex];
    modalImg.src = img.src;
    modalImg.style.width = 'auto';
    modalImg.style.height = 'auto';
    captionText.innerHTML = img.alt;
    resolutionText.innerHTML = img.dataset.resolution;
    updateThumbnails();
}

function updateThumbnails() {
    var thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumbnail, index) => {
        if (index === currentIndex) {
            thumbnail.classList.add('thumbnail-active');
            thumbnail.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            thumbnail.classList.remove('thumbnail-active');
        }
    });
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    closeModal();
}

// Next/previous controls
function plusSlides(n) {
    currentIndex += n;
    if (currentIndex >= images.length) {
        currentIndex = 0;
    } else if (currentIndex < 0) {
        currentIndex = images.length - 1;
    }
    updateModalContent();
}

var prev = document.querySelector('.prev');
var next = document.querySelector('.next');

prev.onclick = function () {
    plusSlides(-1);
}

next.onclick = function () {
    plusSlides(1);
}

// Add keyboard navigation
document.addEventListener('keydown', function(event) {
    if (modal.style.display === 'block') {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            plusSlides(-1);
        } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            plusSlides(1);
        } else if (event.key === 'Escape') {
            closeModal();
        }
    }
});

// Highlight active section in sidebar
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.gallery-section, .paper-info');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });

    // 如果页面滚动到顶部，移除所有激活状态
    if (window.pageYOffset === 0) {
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
    }
});

// Update thumbnails on scroll
window.addEventListener('scroll', () => {
    let currentIndex = -1;
    images.forEach((img, index) => {
        const rect = img.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)) {
            currentIndex = index;
        }
    });

    if (currentIndex !== -1) {
        updateThumbnails();
    }
});
