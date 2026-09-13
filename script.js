// Navigation scroll effect (Blur & border when scrolling)
const header = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');

hamburgerBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    
    // Animate hamburger lines into X cross or similar if desired
    const spans = hamburgerBtn.querySelectorAll('span');
    if (mobileMenu.classList.contains('active')) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.mob-link, .mob-btn').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        const spans = hamburgerBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Subtle background canvas animation (Particles/Grid dots)
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Initialize minimal background floating points
const particleCount = Math.floor(window.innerWidth * window.innerHeight / 25000);

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.radius = Math.random() * 1.2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw subtle grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.012)';
    ctx.lineWidth = 1;
    const gridSize = 80;
    
    for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // Update and draw particles
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animateParticles);
}

animateParticles();

/* =========================================================
   NOTEZ INTERACTIVE VIDEO
   Zoom + Drag + Reset + Fullscreen
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const videoViewer = document.getElementById("notezVideoViewer");
    const videoViewport = document.getElementById("videoViewport");
    const videoContent = document.getElementById("videoContent");

    const zoomInBtn = document.getElementById("zoomInBtn");
    const zoomOutBtn = document.getElementById("zoomOutBtn");
    const resetZoomBtn = document.getElementById("resetZoomBtn");
    const fullscreenBtn = document.getElementById("fullscreenBtn");
    const zoomLevel = document.getElementById("zoomLevel");

    if (
        !videoViewer ||
        !videoViewport ||
        !videoContent
    ) {
        return;
    }


    /* =====================================================
       SETTINGS
       ===================================================== */

    let scale = 1;

    const MIN_SCALE = 1;
    const MAX_SCALE = 4;
    const ZOOM_STEP = 0.25;

    let positionX = 0;
    let positionY = 0;

    let isDragging = false;

    let startX = 0;
    let startY = 0;

    let startPositionX = 0;
    let startPositionY = 0;


    /* =====================================================
       UPDATE VIDEO
       ===================================================== */

    function updateVideo() {

        videoContent.style.transform =
            `translate(calc(-50% + ${positionX}px), calc(-50% + ${positionY}px)) scale(${scale})`;

        zoomLevel.textContent =
            `${Math.round(scale * 100)}%`;
    }


    /* =====================================================
       LIMIT DRAGGING
       ===================================================== */

    function limitPosition() {

        const viewportWidth = videoViewport.clientWidth;
        const viewportHeight = videoViewport.clientHeight;

        const extraWidth =
            (viewportWidth * scale - viewportWidth) / 2;

        const extraHeight =
            (viewportHeight * scale - viewportHeight) / 2;


        if (scale <= 1) {

            positionX = 0;
            positionY = 0;

            return;
        }


        const maxX = Math.max(0, extraWidth);
        const maxY = Math.max(0, extraHeight);


        positionX = Math.max(
            -maxX,
            Math.min(positionX, maxX)
        );

        positionY = Math.max(
            -maxY,
            Math.min(positionY, maxY)
        );
    }


    /* =====================================================
       ZOOM
       ===================================================== */

    function setZoom(newScale) {

        scale = Math.max(
            MIN_SCALE,
            Math.min(MAX_SCALE, newScale)
        );

        if (scale === 1) {

            positionX = 0;
            positionY = 0;
        }

        limitPosition();

        updateVideo();
    }


    /* =====================================================
       ZOOM IN
       ===================================================== */

    zoomInBtn.addEventListener("click", () => {

        setZoom(scale + ZOOM_STEP);

    });


    /* =====================================================
       ZOOM OUT
       ===================================================== */

    zoomOutBtn.addEventListener("click", () => {

        setZoom(scale - ZOOM_STEP);

    });


    /* =====================================================
       RESET
       ===================================================== */

    resetZoomBtn.addEventListener("click", () => {

        scale = 1;

        positionX = 0;
        positionY = 0;

        updateVideo();

    });


    /* =====================================================
       MOUSE DRAG
       ===================================================== */

    videoViewport.addEventListener("mousedown", (event) => {

        if (scale <= 1) {
            return;
        }

        isDragging = true;

        startX = event.clientX;
        startY = event.clientY;

        startPositionX = positionX;
        startPositionY = positionY;

        videoViewport.classList.add("dragging");

        videoContent.classList.add("is-dragging");

    });


    document.addEventListener("mousemove", (event) => {

        if (!isDragging) {
            return;
        }

        const deltaX =
            event.clientX - startX;

        const deltaY =
            event.clientY - startY;


        positionX =
            startPositionX + deltaX;

        positionY =
            startPositionY + deltaY;


        limitPosition();

        updateVideo();

    });


    document.addEventListener("mouseup", () => {

        if (!isDragging) {
            return;
        }

        isDragging = false;

        videoViewport.classList.remove("dragging");

        videoContent.classList.remove("is-dragging");

    });


    /* =====================================================
       TOUCH DRAG
       ===================================================== */

    videoViewport.addEventListener(
        "touchstart",
        (event) => {

            if (scale <= 1) {
                return;
            }

            if (event.touches.length !== 1) {
                return;
            }

            const touch = event.touches[0];

            isDragging = true;

            startX = touch.clientX;
            startY = touch.clientY;

            startPositionX = positionX;
            startPositionY = positionY;

            videoContent.classList.add("is-dragging");

        },
        { passive: true }
    );


    videoViewport.addEventListener(
        "touchmove",
        (event) => {

            if (!isDragging) {
                return;
            }

            if (event.touches.length !== 1) {
                return;
            }

            const touch = event.touches[0];

            const deltaX =
                touch.clientX - startX;

            const deltaY =
                touch.clientY - startY;


            positionX =
                startPositionX + deltaX;

            positionY =
                startPositionY + deltaY;


            limitPosition();

            updateVideo();

        },
        { passive: true }
    );


    videoViewport.addEventListener(
        "touchend",
        () => {

            isDragging = false;

            videoContent.classList.remove("is-dragging");

        }
    );


    /* =====================================================
       MOUSE WHEEL ZOOM
       ===================================================== */

    videoViewport.addEventListener(
        "wheel",
        (event) => {

            event.preventDefault();

            if (event.deltaY < 0) {

                setZoom(scale + ZOOM_STEP);

            } else {

                setZoom(scale - ZOOM_STEP);

            }

        },
        { passive: false }
    );


    /* =====================================================
       DOUBLE CLICK ZOOM
       ===================================================== */

    videoViewport.addEventListener(
        "dblclick",
        () => {

            if (scale === 1) {

                setZoom(2);

            } else {

                setZoom(1);

            }

        }
    );


    /* =====================================================
       FULLSCREEN
       ===================================================== */

    fullscreenBtn.addEventListener(
        "click",
        async () => {

            try {

                if (!document.fullscreenElement) {

                    await videoViewer.requestFullscreen();

                } else {

                    await document.exitFullscreen();

                }

            } catch (error) {

                console.log(
                    "Fullscreen unavailable:",
                    error
                );

            }

        }
    );


    /* =====================================================
       FULLSCREEN BUTTON ICON
       ===================================================== */

    document.addEventListener(
        "fullscreenchange",
        () => {

            if (document.fullscreenElement === videoViewer) {

                fullscreenBtn.textContent = "✕";

            } else {

                fullscreenBtn.textContent = "⛶";

            }

        }
    );


    /* =====================================================
       KEYBOARD SHORTCUTS
       ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                document.activeElement.tagName === "INPUT" ||
                document.activeElement.tagName === "TEXTAREA"
            ) {
                return;
            }


            /* + / = = Zoom in */
            if (
                event.key === "+" ||
                event.key === "="
            ) {

                setZoom(scale + ZOOM_STEP);

            }


            /* - = Zoom out */
            if (event.key === "-") {

                setZoom(scale - ZOOM_STEP);

            }


            /* 0 = Reset */
            if (event.key === "0") {

                setZoom(1);

            }

        }
    );


    /* =====================================================
       INITIAL STATE
       ===================================================== */

    updateVideo();

});
