// Step 2: Collect Additional Info & Submit to Backend
step2Form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = step2Form.querySelector("input[name='name']").value.trim();
    const dob = step2Form.querySelector("input[name='dob']").value.trim();
    const password = step2Form.querySelector("input[name='password']").value.trim();

    if (!name || !dob || !password) {
        alert("All fields are required.");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    const userData = { email: userEmail, name, dob, password };
    console.log("Sending to backend:", userData);

    try {
        const response = await fetch("https://srch-backend.onrender.com/api/signup", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem("token", result.token);
            window.location.href = "/srch-frontend/ProfilePage/index.html";
        } else {
            alert(result.error || "Signup failed. Please try again.");
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("An error occurred. Please try again.");
    }
});
