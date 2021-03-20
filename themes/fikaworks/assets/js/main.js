require("intersection-observer");

// add transition css classes for slow fade in when the element appear in the
// viewport
window.onload = () => {
  const callback = function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("motion-safe:animate-fadeIn");
      } else {
        entry.target.classList.remove("motion-safe:animate-fadeIn");
      }
    });
  };

  const targets = document.querySelectorAll(".show-on-scroll");
  const observer = new IntersectionObserver(callback);

  targets.forEach(function (target) {
    target.classList.add("opacity-0");
    observer.observe(target);
  });
};
