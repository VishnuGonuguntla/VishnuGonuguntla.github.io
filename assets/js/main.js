const year = document.getElementById('year');

if (year) {
  year.textContent = new Date().getFullYear();
}

const fadeInElements = document.querySelectorAll('.fade-in');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeInElements.forEach((element) => observer.observe(element));
} else {
  fadeInElements.forEach((element) => element.classList.add('visible'));
}
