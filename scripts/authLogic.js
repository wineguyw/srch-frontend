document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Auth Logic Loaded on Page");
  
    // Elements with null checks and logging
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
  
    console.log("🔍 Elements Found:", {
      getStartedBtn,
      loginBtn,
      signupModalStep1,
      loginModal,
      authButtons,
      profileIcon,
    });
  
    let userEmail = ""; // Store email entered in step 1
  
    // Function to check for token and update the header
    const updateHeader = () => {
      const token = localStorage.getItem("token");
  
      if (token) {
        if (authButtons) {
          authButtons.style.display = "none"; // Hide login and "Get Started" buttons
          console.log("Logged in: Hiding auth buttons, showing profile icon");
        }
        if (profileIcon) profileIcon.style.display = "block"; // Show profile icon
      } else {
        if (authButtons) {
          authButtons.style.display = "flex"; // Show login and "Get Started" buttons
          console.log("Logged out: Showing auth buttons, hiding profile icon");
        }
        if (profileIcon) profileIcon.style.display = "none"; // Hide profile icon
      }
    };
  
    // Call updateHeader on page load
    updateHeader();
  
    // Show step 1 modal on "Get Started" button click (if elements exist)
    if (getStartedBtn && signupModalStep1) {
      console.log("✅ Adding click listener to Get Started button");
      getStartedBtn.addEventListener("click", () => {
        console.log("🚀 Get Started clicked, showing signup modal Step 1");
        if (signupModalStep1) signupModalStep1.classList.remove("hidden");
      });
    } else {
      console.log("⚠️ Get Started button or signup modal Step 1 not found");
    }
  
    // Hide step 1 modal on close button click (if elements exist)
    if (closeBtnStep1 && signupModalStep1) {
      closeBtnStep1.addEventListener("click", () => {
        if (signupModalStep1) signupModalStep1.classList.add("hidden");
      });
    }
  
    // Handle Step 1 form submission (Email Entry) (if elements exist)
    if (signupFormStep1 && signupModalStep1 && signupModalStep2) {
      signupFormStep1.addEventListener("submit", (e) => {
        e.preventDefault();
        userEmail = signupFormStep1.email.value.trim();
  
        if (userEmail) {
          if (signupModalStep1) signupModalStep1.classList.add("hidden");
          if (signupModalStep2) signupModalStep2.classList.remove("hidden");
        }
      });
    }
  
    // Back to email entry step (if elements exist)
    if (backToEmailBtn && signupModalStep2 && signupModalStep1) {
      backToEmailBtn.addEventListener("click", () => {
        if (signupModalStep2) signupModalStep2.classList.add("hidden");
        if (signupModalStep1) signupModalStep1.classList.remove("hidden");
      });
    }
  
    // Handle Step 2 form submission (User Info) (if elements exist)
    if (signupFormStep2 && signupModalStep2) {
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
          console.log("📤 Submitting signup form with:", { name, email: userEmail, dob, password });
          const response = await fetch("https://srch-backend.onrender.com/api/auth/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email: userEmail, dob, password }),
          });
  
          const result = await response.json();
          console.log("📥 Signup response:", result);
  
          if (response.ok) {
            localStorage.setItem("token", result.token);
            updateHeader();
            if (signupModalStep2) signupModalStep2.classList.add("hidden");
            if (successMessage) successMessage.classList.remove("hidden");
  
            setTimeout(() => {
              window.location.href = "/ProfilePage/";
            }, 3000);
          } else {
            alert(result.error || "Signup failed. Please try again.");
          }
        } catch (error) {
          console.error("❌ Error submitting form:", error);
          alert("An error occurred. Please try again.");
        }
      });
    }
  
    // Show login modal when clicking "Login" button (if elements exist)
    if (loginBtn && loginModal) {
      console.log("✅ Adding click listener to Login button");
      loginBtn.addEventListener("click", () => {
        console.log("🚀 Login clicked, showing login modal");
        if (loginModal) loginModal.classList.remove("hidden");
      });
    } else {
      console.log("⚠️ Login button or login modal not found");
    }
  
    // Close login modal when clicking "X" button (if elements exist)
    if (closeLoginBtn && loginModal) {
      closeLoginBtn.addEventListener("click", () => {
        if (loginModal) loginModal.classList.add("hidden");
      });
    }
  
    // Redirect to sign-up modal if user clicks "Sign up" (if elements exist)
    if (showSignup && loginModal && signupModalStep1) {
      showSignup.addEventListener("click", (e) => {
        e.preventDefault();
        if (loginModal) loginModal.classList.add("hidden");
        if (signupModalStep1) signupModalStep1.classList.remove("hidden");
      });
    }
  
    // Handle login form submission (if elements exist)
    if (loginForm && loginModal) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
  
        const email = loginForm.email.value.trim();
        const password = loginForm.password.value.trim();
  
        if (!email || !password) {
          alert("Please enter both email and password.");
          return;
        }
  
        try {
          console.log("📤 Submitting login form with:", { email, password });
          const response = await fetch("https://srch-backend.onrender.com/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });
  
          const result = await response.json();
          console.log("📥 Login response:", result);
  
          if (response.ok) {
            localStorage.setItem("token", result.token);
            updateHeader();
            if (loginModal) loginModal.classList.add("hidden");
            window.location.href = "/ProfilePage/";
          } else {
            alert(result.error || "Invalid login credentials.");
          }
        } catch (error) {
          console.error("❌ Login error:", error);
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
      updateHeader(); // Update UI after logout
      window.location.href = "/index.html";
    }
  
    // Detect user activity
    document.addEventListener("mousemove", resetLogoutTimer);
    document.addEventListener("keydown", resetLogoutTimer);
    document.addEventListener("click", resetLogoutTimer);
  
    resetLogoutTimer(); // Start the timer
  });