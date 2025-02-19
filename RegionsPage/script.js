document.addEventListener("DOMContentLoaded", () => {
    console.log("📍 Region page loaded successfully!");

    // Example: Dynamic Title Update
    const title = document.querySelector(".region-title");
    if (title) {
        document.title = `${title.textContent} | SRCH`;
    }
});
