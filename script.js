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
   NICO — NOTEZ INTERACTIVE VIDEO
   Zoom + Real Drag + Auto Controls
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const viewer = document.getElementById("notezVideoViewer");
    const viewport = document.getElementById("videoViewport");
    const content = document.getElementById("videoContent");

    const controls = document.getElementById("videoControls");

    const zoomInBtn = document.getElementById("zoomInBtn");
    const zoomOutBtn = document.getElementById("zoomOutBtn");
    const resetBtn = document.getElementById("resetZoomBtn");
    const fullscreenBtn = document.getElementById("fullscreenBtn");

    const zoomLevel = document.getElementById("zoomLevel");

    if (
        !viewer ||
        !viewport ||
        !content
    ) {
        return;
    }


    /* =====================================================
       SETTINGS
       ===================================================== */

    let scale = 1;

    const MIN_ZOOM = 1;

    const MAX_ZOOM = 4;

    const ZOOM_STEP = 0.25;


    let positionX = 0;

    let positionY = 0;


    /* Drag state */
    let dragging = false;

    let dragStartX = 0;

    let dragStartY = 0;

    let originalX = 0;

    let originalY = 0;


    /* Control timeout */
    let controlsTimer = null;


    /* =====================================================
       APPLY TRANSFORM
       ===================================================== */

    function updateTransform() {

        content.style.transform =
            `translate(calc(-50% + ${positionX}px), calc(-50% + ${positionY}px)) scale(${scale})`;

        zoomLevel.textContent =
            `${Math.round(scale * 100)}%`;


        /* Enable dragging */
        if (scale > 1) {

            viewport.classList.add("can-drag");

            viewer.classList.add("zoomed");

        } else {

            viewport.classList.remove("can-drag");

            viewer.classList.remove("zoomed");

            positionX = 0;

            positionY = 0;
        }
    }


    /* =====================================================
       CALCULATE DRAG LIMITS
       ===================================================== */

    function limitPosition() {

        if (scale <= 1) {

            positionX = 0;

            positionY = 0;

            return;
        }


        const width =
            viewport.clientWidth;

        const height =
            viewport.clientHeight;


        /*
         * How far the enlarged video
         * can move horizontally.
         */

        const maxX =
            (width * (scale - 1)) / 2;


        /*
         * How far the enlarged video
         * can move vertically.
         */

        const maxY =
            (height * (scale - 1)) / 2;


        positionX =
            Math.max(
                -maxX,
                Math.min(positionX, maxX)
            );


        positionY =
            Math.max(
                -maxY,
                Math.min(positionY, maxY)
            );
    }


    /* =====================================================
       SET ZOOM
       ===================================================== */

    function setZoom(newZoom) {

        scale =
            Math.max(
                MIN_ZOOM,
                Math.min(MAX_ZOOM, newZoom)
            );


        if (scale === 1) {

            positionX = 0;

            positionY = 0;
        }


        limitPosition();

        updateTransform();

        showControls();
    }


    /* =====================================================
       ZOOM IN
       ===================================================== */

    zoomInBtn.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            setZoom(scale + ZOOM_STEP);

        }
    );


    /* =====================================================
       ZOOM OUT
       ===================================================== */

    zoomOutBtn.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            setZoom(scale - ZOOM_STEP);

        }
    );


    /* =====================================================
       RESET
       ===================================================== */

    resetBtn.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            scale = 1;

            positionX = 0;

            positionY = 0;

            updateTransform();

            showControls();

        }
    );


    /* =====================================================
       MOUSE DRAG
       ===================================================== */

    viewport.addEventListener(
        "mousedown",
        (event) => {

            if (scale <= 1) {
                return;
            }


            /*
             * Important:
             * Do not start dragging if the
             * user clicks a YouTube control.
             */

            if (
                event.target.closest(
                    ".video-controls"
                )
            ) {
                return;
            }


            dragging = true;


            dragStartX =
                event.clientX;

            dragStartY =
                event.clientY;


            originalX =
                positionX;

            originalY =
                positionY;


            viewport.classList.add(
                "dragging"
            );


            content.classList.add(
                "is-dragging"
            );


            event.preventDefault();

        }
    );


    /* =====================================================
       MOUSE MOVE
       ===================================================== */

    document.addEventListener(
        "mousemove",
        (event) => {

            if (!dragging) {
                return;
            }


            const moveX =
                event.clientX -
                dragStartX;


            const moveY =
                event.clientY -
                dragStartY;


            positionX =
                originalX + moveX;


            positionY =
                originalY + moveY;


            limitPosition();

            updateTransform();

        }
    );


    /* =====================================================
       MOUSE UP
       ===================================================== */

    document.addEventListener(
        "mouseup",
        () => {

            if (!dragging) {
                return;
            }


            dragging = false;


            viewport.classList.remove(
                "dragging"
            );


            content.classList.remove(
                "is-dragging"
            );

        }
    );


    /* =====================================================
       TOUCH DRAG
       ===================================================== */

    viewport.addEventListener(
        "touchstart",
        (event) => {

            if (scale <= 1) {
                return;
            }


            if (
                event.touches.length !== 1
            ) {
                return;
            }


            const touch =
                event.touches[0];


            dragging = true;


            dragStartX =
                touch.clientX;

            dragStartY =
                touch.clientY;


            originalX =
                positionX;

            originalY =
                positionY;


            viewport.classList.add(
                "dragging"
            );


            content.classList.add(
                "is-dragging"
            );

        },
        {
            passive: true
        }
    );


    /* =====================================================
       TOUCH MOVE
       ===================================================== */

    viewport.addEventListener(
        "touchmove",
        (event) => {

            if (!dragging) {
                return;
            }


            if (
                event.touches.length !== 1
            ) {
                return;
            }


            const touch =
                event.touches[0];


            const moveX =
                touch.clientX -
                dragStartX;


            const moveY =
                touch.clientY -
                dragStartY;


            positionX =
                originalX + moveX;


            positionY =
                originalY + moveY;


            limitPosition();

            updateTransform();

        },
        {
            passive: true
        }
    );


    /* =====================================================
       TOUCH END
       ===================================================== */

    viewport.addEventListener(
        "touchend",
        () => {

            dragging = false;


            viewport.classList.remove(
                "dragging"
            );


            content.classList.remove(
                "is-dragging"
            );

        }
    );


    /* =====================================================
       MOUSE WHEEL ZOOM
       ===================================================== */

    viewport.addEventListener(
        "wheel",
        (event) => {

            event.preventDefault();


            if (event.deltaY < 0) {

                setZoom(
                    scale + ZOOM_STEP
                );

            } else {

                setZoom(
                    scale - ZOOM_STEP
                );

            }

        },
        {
            passive: false
        }
    );


    /* =====================================================
       DOUBLE CLICK
       ===================================================== */

    viewport.addEventListener(
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
       SHOW CONTROLS
       ===================================================== */

    function showControls() {

        viewer.classList.add(
            "controls-visible"
        );


        clearTimeout(
            controlsTimer
        );


        controlsTimer =
            setTimeout(
                () => {

                    viewer.classList.remove(
                        "controls-visible"
                    );

                },
                4000
            );
    }


    /* =====================================================
       CURSOR NEAR VIDEO
       ===================================================== */

    viewer.addEventListener(
        "mouseenter",
        () => {

            showControls();

        }
    );


    viewer.addEventListener(
        "mousemove",
        () => {

            showControls();

        }
    );


    viewer.addEventListener(
        "mouseleave",
        () => {

            clearTimeout(
                controlsTimer
            );


            controlsTimer =
                setTimeout(
                    () => {

                        viewer.classList.remove(
                            "controls-visible"
                        );

                    },
                    4000
                );

        }
    );


    /* =====================================================
       FULLSCREEN
       ===================================================== */

    fullscreenBtn.addEventListener(
        "click",
        async (event) => {

            event.stopPropagation();


            try {

                if (
                    !document.fullscreenElement
                ) {

                    await viewer.requestFullscreen();

                } else {

                    await document.exitFullscreen();

                }

            } catch (error) {

                console.log(
                    "Fullscreen error:",
                    error
                );

            }

        }
    );


    /* =====================================================
       FULLSCREEN ICON
       ===================================================== */

    document.addEventListener(
        "fullscreenchange",
        () => {

            if (
                document.fullscreenElement === viewer
            ) {

                fullscreenBtn.textContent =
                    "✕";

            } else {

                fullscreenBtn.textContent =
                    "⛶";

            }

        }
    );


    /* =====================================================
       KEYBOARD
       ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "+" ||
                event.key === "="
            ) {

                setZoom(
                    scale + ZOOM_STEP
                );

            }


            if (
                event.key === "-"
            ) {

                setZoom(
                    scale - ZOOM_STEP
                );

            }


            if (
                event.key === "0"
            ) {

                setZoom(1);

            }

        }
    );


    /* =====================================================
       INITIAL STATE
       ===================================================== */

    updateTransform();

});
