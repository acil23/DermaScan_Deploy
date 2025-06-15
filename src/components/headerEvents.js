const initHeaderEvents = () => {
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const navLinks = document.getElementById("nav-links");

  if (hamburgerMenu && navLinks) {
    hamburgerMenu.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }
};

export default initHeaderEvents;
