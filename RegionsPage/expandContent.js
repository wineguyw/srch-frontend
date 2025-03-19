document.addEventListener('DOMContentLoaded', () => {
    const expandLinks = document.querySelectorAll('.expand-link');
    const collapseLinks = document.querySelectorAll('.collapse-link');
    const leftPanel = document.querySelector('.left-panel');
    const middlePanel = document.querySelector('.middle-panel');
    const contentContainer = document.querySelector('.content-container');

    // Handle "Learn More" click to expand
    expandLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            const expandedContent = document.getElementById(targetId);

            // Expand the left panel and hide the middle panel
            leftPanel.classList.add('expanded');
            middlePanel.classList.add('hidden');
            contentContainer.classList.add('expanded'); // Add class to adjust layout

            // Show the expanded content
            expandedContent.classList.add('active');

            // Scroll to the expanded content smoothly
            expandedContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    });

    // Handle "Collapse" click to revert
    collapseLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            const expandedContent = document.getElementById(targetId);

            // Revert the left panel and show the middle panel
            leftPanel.classList.remove('expanded');
            middlePanel.classList.remove('hidden');
            contentContainer.classList.remove('expanded'); // Remove class to revert layout

            // Hide the expanded content
            expandedContent.classList.remove('active');
        });
    });
});