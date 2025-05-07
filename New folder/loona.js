const next = document.getElementById("next")
const prev = document.getElementById("prev")
const carousel = document.querySelector(".carousel")
const items = document.querySelectorAll(".carousel .items")
const countItem = items.length
let active = 1
let other_1 = 0 // Initialize properly
let other_2 = 2 // Initialize properly
let isAnimating = false

// Initialize the carousel properly when the page loads
document.addEventListener("DOMContentLoaded", () => {
  // Make sure the initial classes are set correctly
  items.forEach((item) => {
    item.classList.remove("active", "other_1", "other_2")
  })

  items[active].classList.add("active")
  items[other_1].classList.add("other_1")
  items[other_2].classList.add("other_2")

  // Set up video buttons
  setupVideoButtons()
})

function setupVideoButtons() {
  const videoButtons = document.querySelectorAll(".watch-video");

  videoButtons.forEach((button) => {
    const videoSrc = button.getAttribute("videosrc");
    if (!videoSrc) return;

    // Remove any existing video elements to prevent duplicates
    const existingVideo = button.querySelector("video");
    if (existingVideo) {
      existingVideo.remove();
    }

    // Create video element as background
    const video = document.createElement("video");
    video.src = videoSrc;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;
    video.style.position = "absolute";
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.objectFit = "cover";
    video.style.top = "0";
    video.style.left = "0";
    video.style.zIndex = "0";

    // Add video to button
    button.insertBefore(video, button.firstChild);

    // Force play the video immediately
    video.play().catch((e) => {
      console.log("Auto-play was prevented. This is a browser security feature.", e);
    });

    // Ensure only one span element exists
    const spans = button.querySelectorAll("span");
    if (spans.length > 1) {
      for (let i = 1; i < spans.length; i++) {
        spans[i].remove();
      }
    }

    // Add click handler for the button
    button.onclick = (e) => {
      // Create modal for full video
      const modal = document.createElement("div");
      modal.style.position = "fixed";
      modal.style.top = "0";
      modal.style.left = "0";
      modal.style.width = "100%";
      modal.style.height = "100%";
      modal.style.backgroundColor = "rgba(0,0,0,0.9)";
      modal.style.zIndex = "1000";
      modal.style.display = "flex";
      modal.style.justifyContent = "center";
      modal.style.alignItems = "center";

      // Create full-size video
      const fullVideo = document.createElement("video");
      fullVideo.src = videoSrc;
      fullVideo.controls = true;
      fullVideo.autoplay = true;
      fullVideo.style.maxWidth = "90%";
      fullVideo.style.maxHeight = "90%";

      // Create close button
      const closeBtn = document.createElement("button");
      closeBtn.textContent = "×";
      closeBtn.style.position = "absolute";
      closeBtn.style.top = "20px";
      closeBtn.style.right = "20px";
      closeBtn.style.background = "none";
      closeBtn.style.border = "none";
      closeBtn.style.color = "white";
      closeBtn.style.fontSize = "40px";
      closeBtn.style.cursor = "pointer";

      closeBtn.onclick = () => {
        document.body.removeChild(modal);
      };

      modal.appendChild(fullVideo);
      modal.appendChild(closeBtn);
      document.body.appendChild(modal);
    };
  });
}

// Function to ensure all videos are playing
function ensureAllVideosPlaying() {
  const allVideos = document.querySelectorAll(".watch-video video")
  allVideos.forEach((video) => {
    if (video.paused) {
      video.play().catch((e) => console.log("Could not play video", e))
    }
  })
}

// Call this function periodically to ensure videos keep playing
setInterval(ensureAllVideosPlaying, 2000)

next.onclick = () => {
  if (isAnimating) return
  isAnimating = true

  // Update indices
  active = active + 1 >= countItem ? 0 : active + 1
  other_1 = active - 1 < 0 ? countItem - 1 : active - 1
  other_2 = active + 1 >= countItem ? 0 : active + 1

  // Apply direction class
  carousel.classList.remove("prev")
  carousel.classList.add("next")

  changeSlider()

  setTimeout(() => {
    isAnimating = false
  }, 500)
}

prev.onclick = () => {
  if (isAnimating) return;
  isAnimating = true;

  // Update indices
  active = active - 1 < 0 ? countItem - 1 : active - 1;
  other_1 = active - 1 < 0 ? countItem - 1 : active - 1;
  other_2 = active + 1 >= countItem ? 0 : active + 1;

  // Apply direction class
  carousel.classList.remove("next");
  carousel.classList.add("prev");

  // Update the slider
  changeSlider();

  // Reset animation state after the transition
  setTimeout(() => {
    isAnimating = false;
  }, 500);
}

const changeSlider = () => {
  const itemOldActive = document.querySelector(".carousel .items.active");
  if (itemOldActive) itemOldActive.classList.remove("active");

  const itemOldOther1 = document.querySelector(".carousel .items.other_1");
  if (itemOldOther1) itemOldOther1.classList.remove("other_1");

  const itemOldOther2 = document.querySelector(".carousel .items.other_2");
  if (itemOldOther2) itemOldOther2.classList.remove("other_2");

  // Reset animations for images and captions
  items.forEach((e) => {
    const img = e.querySelector(".image img");
    const caption = e.querySelector(".image figcaption");

    if (img) {
      img.style.animation = "none";
      void img.offsetWidth; // force reflow
      img.style.animation = "";
    }
    if (caption) {
      caption.style.animation = "none";
      void caption.offsetWidth;
      caption.style.animation = "";
    }

    // Remove duplicate buttons
    const videoButtons = e.querySelectorAll(".watch-video");
    if (videoButtons.length > 1) {
      for (let i = 1; i < videoButtons.length; i++) {
        videoButtons[i].remove();
      }
    }
  });

  items[active].classList.add("active");
  items[other_1].classList.add("other_1");
  items[other_2].classList.add("other_2");

  // Fix duplicate text in active slide
  const activeButton = items[active].querySelector(".watch-video");
  if (activeButton) {
    const spans = activeButton.querySelectorAll("span");
    if (spans.length > 1) {
      for (let i = 1; i < spans.length; i++) {
        spans[i].remove();
      }
    }
  }

  // Ensure videos are playing
  ensureAllVideosPlaying();
};
