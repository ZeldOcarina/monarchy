const overlay = document.querySelector(".overlay");
const closeButton = document.querySelector(".overlay__close");
const openButton = document.querySelector(".navigation__button");
const navbar = document.querySelector(".navigation");

if (window.location.pathname !== "/") {
  if (navbar) {
    navbar.style.backgroundColor = "#000000";
    navbar.style.position = "static";
  }
}

if (openButton)
  openButton.addEventListener("click", () => {
    overlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  });

if (closeButton)
  closeButton.addEventListener("click", () => {
    overlay.classList.add("hidden");
    document.body.style.overflow = "auto";
  });
