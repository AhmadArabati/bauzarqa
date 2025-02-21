document.addEventListener('DOMContentLoaded', function () {

    // Go to Top button
    const goToTopButton = document.getElementById('go-to-top');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            goToTopButton.style.display = 'flex';
        } else {
            goToTopButton.style.display = 'none';
        }
    });

    goToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

});