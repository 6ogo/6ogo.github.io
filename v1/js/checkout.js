document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const ugcTitle = params.get('title');
    const ugcDescription = params.get('description');
    const ugcPrice = params.get('price');

    document.getElementById('ugcTitle').textContent = ugcTitle;
    document.getElementById('ugcDescription').textContent = ugcDescription;
    document.getElementById('ugcPrice').textContent = `$${ugcPrice}`;

    // Buy with Card functionality
    document.getElementById('payWithCard').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent form submission for demo purposes
        alert("Processing payment with card...");
    });
    
    // Checkout with PayPal functionality
    document.getElementById('checkoutWithPaypal').addEventListener('click', function () {
        alert("Redirecting to PayPal...");
        window.location.href = "https://www.paypal.com/signin";
    });
});
