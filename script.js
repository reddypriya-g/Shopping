document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded");
    console.log("Connecting...");

    const categories = document.querySelectorAll('nav a');
    categories.forEach(category => {
        category.addEventListener('click', (event) => {
            event.preventDefault();
            const categoryType = event.target.getAttribute('data-category');
            console.log(`Clicked on category: ${categoryType}`);
            fetchProducts(categoryType);
        });
    });

    // Fetch products for the initial category
    fetchProducts('Men');
});
function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '..';
    }
    return text;
}
function fetchProducts(category) {
    console.log(`Fetching products for category: ${category}`);
    fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json')
        .then(response => {
            console.log('Response received');
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('API response:', data);
            const categoryData = data.categories.find(cat => cat.category_name.toLowerCase() === category.toLowerCase());
            if (!categoryData) {
                console.error('Category not found:', category);
                return;
            }
            console.log('Filtered products:', categoryData.category_products);
            displayProducts(categoryData.category_products);
        })
        .catch(error => console.error('Error fetching products:', error));
}

function displayProducts(products) {
    console.log('Displaying products:', products);
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear previous products

    if (products.length === 0) {
        productList.innerHTML = '<p>No products found.</p>';
        return;
    }

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        const discount = Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100);

        productElement.innerHTML = `
       ${product.badge_text ? `<div class="badge"> ${product.badge_text}</div>` : ''}
        <img src="${product.image}" alt="${product.title}">
        <div class="details">
            <h2 class="title-text" title="${product.title}"><span>${truncateText(product.title,11)}</span><span>${product.vendor}</span></h2>
            <div class="price-details">
                <p class="price">Rs ${product.price}</p>
                ${product.compare_at_price ? `<p class="compare-price">₹${product.compare_at_price}</p>` : ''}
                ${discount ? `<p class="discount">${discount}% off</p>` : ''}
            </div>
            <button class="add-to-cart">Add to Cart</button>
        </div>
    `;
        productList.appendChild(productElement);
    });

}
