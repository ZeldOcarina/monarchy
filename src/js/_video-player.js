document.addEventListener("DOMContentLoaded", () => {
  const videoIcon = document.querySelector(".about-video__play-icon");
  const overlays = document.querySelectorAll(".video-player");
  let closeIcons = document.querySelectorAll(".video-player__close");

  videoIcon.addEventListener("click", () => {
    for (let overlay of overlays) overlay.classList.remove("hidden");
  });

  for (let closeIcon of closeIcons)
    closeIcon.addEventListener("click", () => {
      for (let overlay of overlays) overlay.classList.add("hidden");
    });
});
