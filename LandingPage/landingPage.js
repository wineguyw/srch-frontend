document.addEventListener('DOMContentLoaded', () => {
  const regionItems = document.querySelectorAll('.region-item');

  regionItems.forEach(item => {
    item.addEventListener('click', () => {
      const link = item.getAttribute('data-link');
      if (link) {
        window.location.href = link;
      }
    });
  });
});