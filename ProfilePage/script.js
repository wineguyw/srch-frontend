document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
  
    const profileIcon = document.getElementById("profile-icon");
    const loginButton = document.getElementById("login-button");
    const getStartedButton = document.getElementById("get-started-button");
  
    if (token) {
      // User is logged in
      profileIcon.style.display = "block";
      loginButton.style.display = "none";
      getStartedButton.style.display = "none";
    } else {
      // User is not logged in
      profileIcon.style.display = "none";
      loginButton.style.display = "block";
      getStartedButton.style.display = "block";
    }
  });
  