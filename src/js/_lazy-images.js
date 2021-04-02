(function () {
  const imgTargets = document.querySelectorAll("img[data-src]");

  if (imgTargets.length === 0) return;

  const loadImg = function (entries, observer) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      console.log(entry.target);

      // Replace src with data-src
      entry.target.src = entry.target.dataset.src;

      entry.target.addEventListener("load", function () {
        entry.target.classList.remove("lazy-img");
      });

      observer.unobserve(entry.target);
    });
  };

  const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    //rootMargin: "-100px",
  });

  imgTargets.forEach((img) => imgObserver.observe(img));
})();
