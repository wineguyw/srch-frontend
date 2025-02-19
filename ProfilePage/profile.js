document.addEventListener("DOMContentLoaded", async () => {
  const userNameElement = document.getElementById("user-name");
  const logoutButton = document.getElementById("logout-button");

  try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "./index.html";
        return;
      }

      // Fetch user data
      const response = await fetch("https://srch-backend.onrender.com/api/profile", {
        headers: {
              Authorization: `Bearer ${token}`,
          },
      });

      const userData = await response.json();

      if (response.ok) {
          userNameElement.textContent = `Hello, ${userData.name}!`;
      } else {
          console.error("Failed to fetch user data:", userData.error);
          localStorage.removeItem("token");
          window.location.href = "./index.html";
        }
  } catch (error) {
      console.error("Error fetching user data:", error);
      localStorage.removeItem("token");
      window.location.href = "./index.html";
    }

  // Auto Logout After 1 Hour of Inactivity
  let logoutTimer;

  function resetLogoutTimer() {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(() => {
          logoutUser();
      }, 3600000); // 1 hour (60 min * 60 sec * 1000 ms)
  }

  function logoutUser() {
      alert("You've been logged out due to inactivity.");
      localStorage.removeItem("token");
      window.location.href = "/LandingPage/index.html"; // Redirect to homepage
  }

  // Detect user activity to reset the timer
  document.addEventListener("mousemove", resetLogoutTimer);
  document.addEventListener("keydown", resetLogoutTimer);
  document.addEventListener("click", resetLogoutTimer);

  // Start the inactivity timer when page loads
  resetLogoutTimer();

  // Manual Logout Button
  if (logoutButton) {
      logoutButton.addEventListener("click", () => {
          localStorage.removeItem("token");
          window.location.href = "./index.html";
        });
  }
});
