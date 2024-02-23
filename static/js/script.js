var slideIndex = 1;

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("productCard");
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "grid";
}

function plusSlides(n) {
    showSlides(slideIndex += n);
}

$(document).ready(function () {
    $.post('/shower', function(data) {
        var products = data[0]['content']['results']['organic'];
        var query = data[0]['content']['query'];
        var cardsHtml = '';
        products.forEach(function (product) {
            cardsHtml += '<div class="productCard">';
            cardsHtml += '<img class="productImage" src="' + product.url_image + '" alt="Product Image">';
            cardsHtml += '<div class="productInfo">';
            cardsHtml += '<p class="query">' + query + '</p>';
            cardsHtml += '<p class="productTitle">' + product.title + '</p>';
            cardsHtml += '<p class="productPrice">Price: ' + product.price + ' INR</p>';
            cardsHtml += '<a class="productLink" href="https://www.amazon.in' + product.url + '" target="_blank">Go to the page</a>';
            cardsHtml += '</div>';
            cardsHtml += '</div>';
        });
        $('#scraper_results').html(cardsHtml);
        showSlides(slideIndex);
    });
});
