document.addEventListener("DOMContentLoaded", () => {
  const getStartedBtn = document.getElementById("get-started-btn");
  const signupModalStep1 = document.getElementById("signup-modal-step1");
  const signupModalStep2 = document.getElementById("signup-modal-step2");
  const closeBtnStep1 = document.getElementById("close-modal-btn");
  const backToEmailBtn = document.getElementById("back-to-email");
  const signupFormStep1 = document.getElementById("signup-form-step1");
  const signupFormStep2 = document.getElementById("signup-form-step2");
  const successMessage = document.getElementById("signup-success-message");
  const authButtons = document.getElementById("auth-buttons");
  const profileIcon = document.getElementById("profile-icon");

  // Login Elements
  const loginBtn = document.getElementById("login-button");
  const loginModal = document.getElementById("login-modal");
  const closeLoginBtn = document.getElementById("close-login-btn");
  const loginForm = document.getElementById("login-form");
  const showSignup = document.getElementById("show-signup");

  let userEmail = ""; // Store email entered in step 1

  // Function to check for token and update the header
  const updateHeader = () => {
    const token = localStorage.getItem("token");

    if (token) {
      authButtons.style.display = "none"; // Hide login and "Get Started" buttons
      profileIcon.style.display = "block"; // Show profile icon
    } else {
      authButtons.style.display = "flex"; // Show login and "Get Started" buttons
      profileIcon.style.display = "none"; // Hide profile icon
    }
  };

  // Call updateHeader on page load
  updateHeader();

  // Show step 1 modal on "Get Started" button click
  if (getStartedBtn) {
    getStartedBtn.addEventListener("click", () => {
      signupModalStep1?.classList.remove("hidden");
    });
  }

  // Hide step 1 modal on close button click
  if (closeBtnStep1) {
    closeBtnStep1.addEventListener("click", () => {
      signupModalStep1?.classList.add("hidden");
    });
  }

  // Handle Step 1 form submission (Email Entry)
  if (signupFormStep1) {
    signupFormStep1.addEventListener("submit", (e) => {
      e.preventDefault();
      userEmail = signupFormStep1.email.value.trim();

      if (userEmail) {
        signupModalStep1?.classList.add("hidden");
        signupModalStep2?.classList.remove("hidden");
      }
    });
  }

  // Back to email entry step
  if (backToEmailBtn) {
    backToEmailBtn.addEventListener("click", () => {
      signupModalStep2?.classList.add("hidden");
      signupModalStep1?.classList.remove("hidden");
    });
  }

  // Handle Step 2 form submission (User Info)
  if (signupFormStep2) {
    signupFormStep2.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = signupFormStep2.name.value.trim();
      const dob = signupFormStep2.dob.value.trim();
      const password = signupFormStep2.password.value.trim();

      if (!name || !dob || !password) {
        alert("Please fill out all fields.");
        return;
      }

      try {
        // Send data to API
        const response = await fetch("https://srch-backend.onrender.com/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email: userEmail, dob, password }),
        });

        const result = await response.json();

        if (response.ok) {
          // Store token in localStorage
          localStorage.setItem("token", result.token);

          // Update header to show profile icon
          updateHeader();

          // Ensure elements exist before modifying classList
          if (signupModalStep2) signupModalStep2.classList.add("hidden");
          if (successMessage) successMessage.classList.remove("hidden");

          // Redirect to profile page after 3 seconds
          setTimeout(() => {
            window.location.href = "/srch-frontend/ProfilePage/";
          }, 3000);
        } else {
          alert(result.error || "Signup failed. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("An error occurred. Please try again.");
      }
    });
  }

  // 💡 LOGIN FUNCTIONALITY

  // Show login modal when clicking "Login" button
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      loginModal.classList.remove("hidden");
    });
  }

  // Close login modal when clicking "X" button
  if (closeLoginBtn) {
    closeLoginBtn.addEventListener("click", () => {
      loginModal.classList.add("hidden");
    });
  }

  // Redirect to sign-up modal if user clicks "Sign up"
  if (showSignup) {
    showSignup.addEventListener("click", (e) => {
      e.preventDefault();
      loginModal.classList.add("hidden");
      signupModalStep1.classList.remove("hidden");
    });
  }

  // Handle login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = loginForm.email.value.trim();
      const password = loginForm.password.value.trim();

      if (!email || !password) {
        alert("Please enter both email and password.");
        return;
      }

      try {
        const response = await fetch("https://srch-backend.onrender.com/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
          // Store JWT token in localStorage
          localStorage.setItem("token", result.token);

          // Update UI to reflect login status
          updateHeader();

          // Close login modal
          loginModal.classList.add("hidden");

          // Redirect to profile page
          window.location.href = "/srch-frontend/ProfilePage/";
        } else {
          alert(result.error || "Invalid login credentials.");
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred while logging in. Please try again.");
      }
    });
  }

  // Auto Logout After 1 Hour of Inactivity
  let logoutTimer;

  function resetLogoutTimer() {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(() => {
      logoutUser();
    }, 3600000); // 1 hour (60 minutes * 60 seconds * 1000 ms)
  }

  function logoutUser() {
    alert("You've been logged out due to inactivity.");
    localStorage.removeItem("token");
    window.location.href = "/srch-frontend/LandingPage/";
  }

  // Detect user activity
  document.addEventListener("mousemove", resetLogoutTimer);
  document.addEventListener("keydown", resetLogoutTimer);
  document.addEventListener("click", resetLogoutTimer);

  resetLogoutTimer(); // Start the timer
});

document.addEventListener("DOMContentLoaded", () => {
  const regionItems = document.querySelectorAll(".region-item");

  regionItems.forEach(item => {
      item.addEventListener("click", () => {
        const link = item.getAttribute("data-link");
        if (link.startsWith("/")) {
            window.location.href = "/srch-frontend" + link;
        } else {
            window.location.href = "/srch-frontend/RegionsPage/" + link;        
          }
      });

      // Optional: Add a hover effect to indicate interactivity
      item.style.cursor = "pointer";
  });
});

