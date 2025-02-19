let logoutTimer; // Define globally so it can be accessed anywhere

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Header Script Loaded!");

    const profileIcon = document.getElementById("profile-icon");
    const profileDropdown = document.getElementById("profile-dropdown");
    const loginButton = document.querySelector(".login-btn");
    const getStartedButton = document.querySelector(".get-started-btn");

    console.log("🔍 Checking Elements:");
    console.log("Profile Icon:", profileIcon);
    console.log("Login Button:", loginButton);
    console.log("Get Started Button:", getStartedButton);

    // Check if user is logged in
    if (!localStorage.getItem("token")) {
        if (profileIcon) profileIcon.style.display = "none"; // Hide profile icon
        if (loginButton) loginButton.style.display = "block"; // Show login
        if (getStartedButton) getStartedButton.style.display = "block"; // Show Get Started
    } else {
        if (profileIcon) profileIcon.style.display = "block"; // Show profile icon
        if (loginButton) loginButton.style.display = "none"; // Hide login
        if (getStartedButton) getStartedButton.style.display = "none"; // Hide Get Started
    }

    // Show dropdown on hover (only if elements exist)
    if (profileIcon && profileDropdown) {
        profileIcon.addEventListener("mouseenter", () => {
            profileDropdown.classList.add("visible");
        });

        profileDropdown.addEventListener("mouseleave", () => {
            profileDropdown.classList.remove("visible");
        });

        // Hide dropdown when clicking outside
        document.addEventListener("click", (event) => {
            if (!profileIcon.contains(event.target) && !profileDropdown.contains(event.target)) {
                profileDropdown.classList.remove("visible");
            }
        });
    }

    // 🔹 Auto Logout After 1 Hour of Inactivity
    function resetLogoutTimer() {
        clearTimeout(logoutTimer);
        logoutTimer = setTimeout(() => {
            logoutUser();
        }, 3600000); // 1 hour = 60 minutes * 60 seconds * 1000 ms
    }

    function logoutUser() {
        alert("You've been logged out due to inactivity.");
        localStorage.removeItem("token");
        window.location.href = "./index.html";
    }

    // Detect user activity (resets the timer on movement or interaction)
    document.addEventListener("mousemove", resetLogoutTimer);
    document.addEventListener("keydown", resetLogoutTimer);
    document.addEventListener("click", resetLogoutTimer);

    // Start the timer when the page loads
    resetLogoutTimer();

    console.log("✅ Header Logic Successfully Applied!");
});
