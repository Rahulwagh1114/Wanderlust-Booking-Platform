document.addEventListener("DOMContentLoaded", () => {
  const hamBurgerBtn = document.querySelector(".navbar-toggler");
  const filters = document.getElementById("filters");
  const nav = document.querySelector(".navbar-collapse");

  if (!hamBurgerBtn || !filters || !nav) return;

  nav.addEventListener("shown.bs.collapse", () => {
    if (window.innerWidth <= 992) {
      filters.style.marginTop = nav.offsetHeight + "px";
    }
  });

  nav.addEventListener("hidden.bs.collapse", () => {
    filters.style.marginTop = "0px";
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 992) {
      filters.style.marginTop = "0px";
    }
  });
});