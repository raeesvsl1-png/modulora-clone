document.addEventListener('DOMContentLoaded', () => {
  // Trigger entrance animations after DOM ready
  requestAnimationFrame(() => {
    document.body.classList.add('page-loaded');
  });

  // Element references
  const form = document.getElementById('waitlistForm');
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const submitBtn = document.getElementById('submitBtn');
  const btnSpinner = document.getElementById('btnSpinner');
  const handleBadge = document.getElementById('handleBadge');
  const successView = document.getElementById('successView');
  const reservedHandle = document.getElementById('reservedHandle');
  const spotNumber = document.getElementById('spotNumber');
  const shareBtn = document.getElementById('shareBtn');
  const toast = document.getElementById('toast');
  const ambientGlow = document.getElementById('ambientGlow');
  const usernameError = document.getElementById('usernameError');
  const emailError = document.getElementById('emailError');

  // Mouse ambient glow effect
  window.addEventListener('mousemove', (e) => {
    if (ambientGlow) {
      ambientGlow.style.left = `${e.clientX}px`;
      ambientGlow.style.top = `${e.clientY}px`;
    }
  });

  // Handle sanitization & live validation
  function validateUsername(val) {
    const clean = val.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
    return clean;
  }

  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  }

  function updateFormState() {
    const rawUser = usernameInput.value.trim();
    const cleanUser = validateUsername(rawUser);
    const emailVal = emailInput.value.trim();

    // Auto fix invalid chars in input display smoothly
    if (rawUser !== cleanUser) {
      usernameInput.value = cleanUser;
    }

    const isUsernameValid = cleanUser.length >= 2;
    const isEmailValid = isValidEmail(emailVal);

    // Show/hide available handle badge
    if (isUsernameValid) {
      handleBadge.classList.remove('hidden');
    } else {
      handleBadge.classList.add('hidden');
    }

    // Enable button only when both fields valid
    if (isUsernameValid && isEmailValid) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  }

  // Event Listeners for Live Validation
  usernameInput.addEventListener('input', updateFormState);
  emailInput.addEventListener('input', updateFormState);

  // Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const rawUser = usernameInput.value.trim();
    const emailVal = emailInput.value.trim();

    if (!rawUser || rawUser.length < 2) {
      usernameError.textContent = 'Please choose a username (at least 2 chars)';
      return;
    }
    usernameError.textContent = '';

    if (!isValidEmail(emailVal)) {
      emailError.textContent = 'Please enter a valid email address';
      return;
    }
    emailError.textContent = '';

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Joining...';
    btnSpinner.classList.remove('hidden');

    // Simulate API request delay
    setTimeout(() => {
      // Calculate or fetch fake spot number
      const mockSpot = Math.floor(1200 + Math.random() * 800);
      
      reservedHandle.textContent = `@${rawUser}`;
      spotNumber.textContent = `#${mockSpot.toLocaleString()}`;

      // Switch to success view
      form.classList.add('hidden');
      successView.classList.remove('hidden');
    }, 800);
  });

  // Share button clipboard functionality
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const shareUrl = window.location.href;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl).then(() => {
          showToast('Copied link to clipboard!');
        }).catch(() => {
          showToast('Waitlist reserved!');
        });
      } else {
        showToast('Waitlist reserved!');
      }
    });
  }

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove('hidden');
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.classList.add('hidden');
      }, 300);
    }, 2500);
  }
});
