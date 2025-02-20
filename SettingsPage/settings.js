document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logout-button");
    const profileIcon = document.getElementById("profile-icon");
    const authButtons = document.getElementById("auth-buttons");

    // Function to update header based on login status
    const updateHeader = () => {
        const token = localStorage.getItem("token");

        if (token) {
            authButtons.style.display = "none"; // Hide login buttons
            profileIcon.style.display = "block"; // Show profile icon
        } else {
            authButtons.style.display = "flex"; // Show login buttons
            profileIcon.style.display = "none"; // Hide profile icon
        }
    };

    updateHeader(); // Call on page load

    // Logout Functionality
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("token"); // Remove stored session data
        alert("You have been logged out.");
        window.location.href = "/index.html"; // Redirect to homepage
    });
});
