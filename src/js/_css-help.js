const mediaQuery = window.matchMedia('(max-width: 812px)');

if(window.location.pathname !== '/' && mediaQuery.matches) {
    const navbar = document.querySelector('.navigation');
    const navigationTop = document.querySelector('.navigation__top');
    if(navbar) navbar.style.height = '100vh';
    if(navigationTop) navigationTop.style.alignItems = "flex-start";
}