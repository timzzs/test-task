$(document).ready(function () {
    $('[data-toggle="bar-menu"]').click(function (event) {
        $('.header__burger,.header__menu').toggleClass('active');
        $('body').toggleClass('lock');
    });

    //Close circle inspiration
    let circle;
    let circle_button;

    $('[data-inspiration]').click(function(event) {
        const inspirationId = $(this).attr('data-inspiration')

        $('[data-inspiration-block]').removeClass('active');
        $('[data-inspiration-block="'+inspirationId+'"]').addClass('active');

        circle = document.querySelector('[data-inspiration-block="'+inspirationId+'"]');
        circle_button = this;
    });

    document.addEventListener('click',event => {

        if (!circle) return
        if (!circle_button) return

        const is_circle = circle.contains(event.target)
        const is_circle_button = circle_button.contains(event.target)

        if (is_circle || is_circle_button) return

        document.querySelectorAll('.product__items').forEach(item => {
            item.classList.remove('active')
        })

    })

    //main Slider
    $('[data-slider="main"]').owlCarousel({
        loop:true,
        nav:false,
        margin:10,
        items: 1,
        autoplay: false,
        autoplayTimeout: 5000,
        smartSpeed: 900,
    });

    //designer Slider
    $('[data-slider="designer"]').owlCarousel({
        items:6,
        loop:false,
        margin:10,
        nav:false,
        dots:false,
    })
});

//Эта же функция burger menu, но на JS
/*document.querySelector('.header__burger').addEventListener('click', () => {
    document.querySelectorAll('.header__burger, .header__menu').forEach(item => {
        item.classList.toggle('active')
    })
})*/

