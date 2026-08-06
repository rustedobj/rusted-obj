document.addEventListener('DOMContentLoaded', () => {
  // Testimonial Carousel
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
  }

  function nextSlide() {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  function startSlideShow() {
    slideInterval = setInterval(nextSlide, 6000);
  }

  function resetSlideShow() {
    clearInterval(slideInterval);
    startSlideShow();
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const targetIndex = parseInt(e.target.getAttribute('data-index'), 10);
      showSlide(targetIndex);
      resetSlideShow();
    });
  });

  startSlideShow();

  // Video Modal Lightbox
  const workCards = document.querySelectorAll('.work-card');
  const videoModal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideo');
  const modalClose = document.getElementById('modalClose');
  const youtubeModal = document.getElementById('youtubeModal');
  const youtubeIframe = document.getElementById('youtubeIframe');
  const youtubeDescription = document.getElementById('youtubeDescription');

  workCards.forEach(card => {
    card.addEventListener('click', () => {
      const videoUrl = card.getAttribute('data-video-url');
      const description = card.getAttribute('data-description') || '';
      if (videoUrl) {
        if (videoUrl.includes('youtube')) {
          // Open YouTube embed modal
          // Use & or ? depending on if the URL already has query parameters
          const sep = videoUrl.includes('?') ? '&' : '?';
          youtubeIframe.src = videoUrl + sep + "autoplay=1";
          youtubeDescription.textContent = description;
          youtubeDescription.classList.remove('hidden');
          if (card.classList.contains('ar-9-16')) {
            youtubeModal.classList.add('vertical');
          } else {
            youtubeModal.classList.remove('vertical');
          }
          youtubeModal.classList.add('active');
        } else {
          // Open regular video modal
          modalVideo.src = videoUrl;
          videoModal.classList.add('active');
          modalVideo.play().catch(err => {
            console.log('Autoplay prevented:', err);
          });
        }
      }
    });
  });

  function closeModal() {
    videoModal.classList.remove('active');
    modalVideo.pause();
    modalVideo.src = '';
  }

  modalClose.addEventListener('click', closeModal);
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
      closeModal();
    }
  });

  // YouTube modal close handling
  const youtubeClose = document.getElementById('youtubeClose');
  youtubeClose.addEventListener('click', () => {
    youtubeModal.classList.remove('active');
    youtubeModal.classList.remove('vertical');
    youtubeIframe.src = '';
    youtubeDescription.textContent = '';
    youtubeDescription.classList.add('hidden');
  });
  youtubeModal.addEventListener('click', (e) => {
    if (e.target === youtubeModal) {
      youtubeClose.click();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (videoModal.classList.contains('active')) {
        closeModal();
      }
      if (youtubeModal.classList.contains('active')) {
        youtubeClose.click();
      }
    }
  });

  // Clickable Strategy Steps
  const stepCards = document.querySelectorAll('.step-card');
  const explanationBox = document.getElementById('stepExplanationBox');
  const explanationText = document.getElementById('stepExplanationText');

  stepCards.forEach(card => {
    card.addEventListener('click', () => {
      // If clicking the currently active card, close explanation box
      if (card.classList.contains('active')) {
        card.classList.remove('active');
        explanationBox.classList.remove('active');
        return;
      }

      // If switching steps, perform a smooth cross-fade of the text content
      if (explanationBox.classList.contains('active')) {
        explanationBox.style.opacity = '0';
        stepCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        setTimeout(() => {
          const explanation = card.getAttribute('data-explanation');
          explanationText.textContent = explanation;
          explanationBox.style.opacity = '1';
        }, 180);
      } else {
        // If opening explanation box for the first time
        stepCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        const explanation = card.getAttribute('data-explanation');
        explanationText.textContent = explanation;
        explanationBox.classList.add('active');
        explanationBox.style.opacity = '1';
      }
    });
  });

  // BTS Popup Logic
  const btsBtn = document.getElementById('btsBtn');
  const btsPopup = document.getElementById('btsPopup');
  const btsCancel = document.getElementById('btsCancel');
  const btsProceed = document.getElementById('btsProceed');

  if (btsBtn && btsPopup) {
    btsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      btsPopup.classList.add('active');
    });

    const closeBtsPopup = () => {
      btsPopup.classList.remove('active');
    };

    btsCancel.addEventListener('click', closeBtsPopup);
    btsProceed.addEventListener('click', () => {
      closeBtsPopup();
      window.open('https://drive.google.com/drive/folders/1Y0tGr_PBtjT7Wv84ji59oH7SdcQZ4tZB?usp=sharing', '_blank');
    });

    btsPopup.addEventListener('click', (e) => {
      if (e.target === btsPopup) {
        closeBtsPopup();
      }
    });
  }

  // Hero Video Showcase Logic
  const profileWrapper = document.getElementById('profileWrapper');
  const heroContent = document.getElementById('heroContent');
  const showcaseVideoContainer = document.getElementById('showcaseVideoContainer');
  const showcaseVideo = document.getElementById('showcaseVideo');
  const videoBlackOverlay = document.getElementById('videoBlackOverlay');
  const showcaseMuteBtn = document.getElementById('showcaseMuteBtn');
  const heroSection = document.getElementById('hero');

  if (profileWrapper && showcaseVideo && heroContent && videoBlackOverlay) {
    let isAudioFading = false;
    let audioFadeInterval = null;
    let audioFadeInInterval = null;

    if (showcaseMuteBtn) {
      showcaseMuteBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent clicking background triggers
        showcaseVideo.muted = !showcaseVideo.muted;
        const volOn = showcaseMuteBtn.querySelector('.volume-on');
        const volOff = showcaseMuteBtn.querySelector('.volume-off');
        if (showcaseVideo.muted) {
          volOn.classList.add('hidden');
          volOff.classList.remove('hidden');
        } else {
          volOn.classList.remove('hidden');
          volOff.classList.add('hidden');
        }
      });
    }

    const resetShowcase = () => {
      if (audioFadeInterval) clearInterval(audioFadeInterval);
      if (audioFadeInInterval) clearInterval(audioFadeInInterval);
      showcaseVideoContainer.classList.remove('playing');
      videoBlackOverlay.classList.remove('hidden'); // Reset to black
      showcaseVideo.pause();
      showcaseVideo.currentTime = 0; // reset video to start
      showcaseVideo.muted = false; // reset mute state
      if (showcaseMuteBtn) {
        const volOn = showcaseMuteBtn.querySelector('.volume-on');
        const volOff = showcaseMuteBtn.querySelector('.volume-off');
        if (volOn && volOff) {
          volOn.classList.remove('hidden');
          volOff.classList.add('hidden');
        }
      }
      heroContent.classList.remove('hidden');
    };

    profileWrapper.addEventListener('click', () => {
      // Hide the hero text and profile
      heroContent.classList.add('hidden');
      
      // Reset audio state
      if (audioFadeInterval) clearInterval(audioFadeInterval);
      if (audioFadeInInterval) clearInterval(audioFadeInInterval);
      
      showcaseVideo.volume = 0;
      isAudioFading = false;
      
      // Show the showcase container (which starts out fully black due to overlay)
      showcaseVideoContainer.classList.add('playing');
      
      // Play video, and once it actually starts, fade out the black overlay and fade in audio
      showcaseVideo.play().then(() => {
        // Fade out the black overlay so video appears
        videoBlackOverlay.classList.add('hidden');

        // Smoothly fade in volume to 1 over 800ms for extra smoothness
        const fadeDuration = 800; // 800ms
        const fadeSteps = 30;
        const stepTime = fadeDuration / fadeSteps;
        const volumeStep = 1 / fadeSteps;

        audioFadeInInterval = setInterval(() => {
          if (showcaseVideo.volume + volumeStep < 1) {
            showcaseVideo.volume += volumeStep;
          } else {
            showcaseVideo.volume = 1;
            clearInterval(audioFadeInInterval);
          }
        }, stepTime);
      }).catch(err => {
        console.log('Autoplay prevented:', err);
      });
    });

    // Intersection Observer to reset hero when scrolling away
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1 // Reset when less than 10% of hero is visible
    };

    const fadeAndResetShowcase = () => {
      if (isAudioFading) return;
      isAudioFading = true;
      videoBlackOverlay.classList.remove('hidden');
      heroContent.classList.remove('hidden');
      const fadeDuration = 300;
      const fadeSteps = 15;
      const stepTime = fadeDuration / fadeSteps;
      const volumeStep = showcaseVideo.volume / fadeSteps;
      audioFadeInterval = setInterval(() => {
        if (showcaseVideo.volume - volumeStep > 0) {
          showcaseVideo.volume -= volumeStep;
        } else {
          showcaseVideo.volume = 0;
          clearInterval(audioFadeInterval);
        }
      }, stepTime);
      setTimeout(() => {
        resetShowcase();
        isAudioFading = false;
      }, 1000); // Wait for the fade to black overlay to complete before resetting
    };

    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // If we scrolled off the hero section
        if (!entry.isIntersecting) {
          // Reset only if it was playing
          if (showcaseVideoContainer.classList.contains('playing')) {
            fadeAndResetShowcase();
          }
        }
      });
    }, observerOptions);

    heroObserver.observe(heroSection);

    // Reset hero when the video ends naturally (fallback)
    showcaseVideo.addEventListener('ended', () => {
      if (showcaseVideoContainer.classList.contains('playing')) {
        resetShowcase();
      }
    });

    // Timeupdate listener to handle custom stop/fade at 15.4-16.4s
    showcaseVideo.addEventListener('timeupdate', () => {
      // Start fading out to black and bringing elements back at 15.4 seconds
      if (showcaseVideo.currentTime >= 15.4 && showcaseVideoContainer.classList.contains('playing') && !heroContent.classList.contains('hidden') === false) {
        // Fade the video to black using the overlay
        videoBlackOverlay.classList.remove('hidden');
        heroContent.classList.remove('hidden');
      }

      // Audio fade out over the last 0.3 seconds (from 16.1 to 16.4)
      if (showcaseVideo.currentTime >= 16.1 && !isAudioFading && showcaseVideo.volume > 0 && showcaseVideoContainer.classList.contains('playing')) {
        isAudioFading = true;
        const fadeDuration = 300; // 300ms
        const fadeSteps = 15;
        const stepTime = fadeDuration / fadeSteps;
        const volumeStep = showcaseVideo.volume / fadeSteps;

        audioFadeInterval = setInterval(() => {
          if (showcaseVideo.volume - volumeStep > 0) {
            showcaseVideo.volume -= volumeStep;
          } else {
            showcaseVideo.volume = 0;
            clearInterval(audioFadeInterval);
          }
        }, stepTime);
      }
      
      // Stop and reset at 16.4 seconds
      if (showcaseVideo.currentTime >= 16.4 && !showcaseVideo.paused) {
        resetShowcase();
      }
    });
  }
});
