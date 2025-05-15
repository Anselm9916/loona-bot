document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const carousel = document.querySelector(".carousel")
  const items = document.querySelectorAll(".carousel .items")
  const nextBtn = document.getElementById("next")
  const indicators = document.querySelectorAll(".indicator")
  const videoModal = document.getElementById("videoModal")
  const modalVideo = document.getElementById("modalVideo")
  const closeModal = document.getElementById("closeModal")
  const videoButtons = document.querySelectorAll(".watch-video")

  // Variables
  const countItem = items.length
  let active = 1 // Start with the second slide active
  let other1 = 0 // Left neighbor
  let other2 = 2 // Right neighbor
  let isAnimating = false

  // Initialize carousel
  function initCarousel() {
    // Reset all items
    items.forEach((item) => {
      item.classList.remove("active", "other_1", "other_2")
    })

    // Set initial state
    items[active].classList.add("active")
    items[other1].classList.add("other_1")
    items[other2].classList.add("other_2")

    // Update indicators
    updateIndicators()

    // Setup video buttons
    setupVideoButtons()
  }

  // Setup video buttons with background videos
  function setupVideoButtons() {
    videoButtons.forEach((button) => {
      const videoSrc = button.getAttribute("videosrc")
      if (!videoSrc) return

      // Remove any existing video elements to prevent duplicates
      const existingVideo = button.querySelector("video")
      if (existingVideo) {
        existingVideo.remove()
      }

      // Create video element as background
      const video = document.createElement("video")
      video.src = videoSrc
      video.muted = true
      video.loop = true
      video.playsInline = true
      video.autoplay = true

      // Add video to button
      button.insertBefore(video, button.firstChild)

      // Force play the video immediately
      video.play().catch((e) => {
        console.log("Auto-play was prevented. This is a browser security feature.", e)
      })

      // Add click handler for the button
      button.onclick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        openVideoModal(videoSrc)
      }
    })
  }

  // Ensure all videos are playing
  function ensureAllVideosPlaying() {
    const allVideos = document.querySelectorAll(".watch-video video")
    allVideos.forEach((video) => {
      if (video.paused) {
        video.play().catch((e) => console.log("Could not play video", e))
      }
    })
  }

  // Update indicators
  function updateIndicators() {
    indicators.forEach((indicator) => {
      indicator.classList.remove("active")
    })
    indicators[active].classList.add("active")
  }

  // Next slide
  function goToNext() {
    if (isAnimating) return
    isAnimating = true

    // Update indices
    active = (active + 1) % countItem
    other1 = (active - 1 + countItem) % countItem
    other2 = (active + 1) % countItem

    // Apply direction class
    carousel.classList.remove("prev")
    carousel.classList.add("next")

    // Update carousel
    changeSlider()

    // Reset animation state
    setTimeout(() => {
      isAnimating = false
    }, 500)
  }

  // Go to specific slide
  function goToSlide(index) {
    if (isAnimating || index === active) return
    isAnimating = true

    // Determine direction
    const direction = index > active ? "next" : "prev"

    // Update indices
    const oldActive = active
    active = index
    other1 = (active - 1 + countItem) % countItem
    other2 = (active + 1) % countItem

    // Apply direction class
    carousel.classList.remove("next", "prev")
    carousel.classList.add(direction)

    // Update carousel
    changeSlider()

    // Reset animation state
    setTimeout(() => {
      isAnimating = false
    }, 500)
  }

  // Update carousel display
  function changeSlider() {
    // Remove old classes
    items.forEach((item) => {
      item.classList.remove("active", "other_1", "other_2")
    })

    // Reset animations
    items.forEach((item) => {
      const img = item.querySelector(".image img")
      const caption = item.querySelector(".image figcaption")

      if (img) {
        img.style.animation = "none"
        void img.offsetWidth // Force reflow
        img.style.animation = ""
      }

      if (caption) {
        caption.style.animation = "none"
        void caption.offsetWidth // Force reflow
        caption.style.animation = ""
      }
    })

    // Apply new classes
    items[active].classList.add("active")
    items[other1].classList.add("other_1")
    items[other2].classList.add("other_2")

    // Update indicators
    updateIndicators()

    // Ensure videos are playing
    ensureAllVideosPlaying()
  }

  // Open video modal
  function openVideoModal(videoSrc) {
    modalVideo.src = videoSrc
    videoModal.classList.add("active")
    document.body.style.overflow = "hidden" // Prevent scrolling
  }

  // Close video modal
  function closeVideoModal() {
    modalVideo.pause()
    videoModal.classList.remove("active")
    document.body.style.overflow = "" // Restore scrolling
  }

  // Event Listeners
  nextBtn.addEventListener("click", goToNext)

  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      goToSlide(index)
    })
  })

  closeModal.addEventListener("click", closeVideoModal)

  // Close modal when clicking outside content
  videoModal.addEventListener("click", (e) => {
    if (e.target === videoModal) {
      closeVideoModal()
    }
  })

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && videoModal.classList.contains("active")) {
      closeVideoModal()
    }
  })

  // Call this function periodically to ensure videos keep playing
  setInterval(ensureAllVideosPlaying, 2000)

  // Initialize carousel
  initCarousel()
})
