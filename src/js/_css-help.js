const mediaQuery = window.matchMedia('(max-width: 812px)');

if(window.location.pathname !== '/' && mediaQuery.matches) {
    const navbar = document.querySelector('.navigation');
    const navigationTop = document.querySelector('.navigation__top');
    navbar.style.height = '100vh';
    navigationTop.style.alignItems = "flex-start";
}