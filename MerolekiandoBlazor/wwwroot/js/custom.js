        // window.addEventListener("scroll", handleInfiniteScroll);
    // Variables to keep track of the current page and the number of products to display per page
    let currentPage = 1;
    const productsPerPage = 12;

    // Function to fetch the products from the server
    function loadProducts() {
        // Make an AJAX call to fetch the products for the current page
        fetch(
            `https://jsonplaceholder.typicode.com/photos?_page=${currentPage}&_limit=${productsPerPage}`
        )
            .then((response) => response.json())
            .then((data) => {
                // Append the new products to the existing list
                const productsContainer = document.querySelector("#products-container");
                data.forEach((product) => {
                    const productElement = createProductElement(product);
                    productsContainer.appendChild(productElement);
                });

                // Increment the current page number
                currentPage++;
            });
        }

    // Function to create a product element
    function createProductElement(product) {
            debugger
    const productElement = document.createElement("div");
    productElement.classList.add("col-6", "col-md-2", "col-sm-3", "px-2", "mb-3");
    productElement.innerHTML = `
    <div class="product-box d-flex flex-column justify-content-center">

        <div class="product-img-box rounded-1 overflow-hidden">
            <img class="w-100 img-fluid"
                src="${product.url}"
                alt="${product.title}" />
        </div>
        <a title="${product.title}" class="text-decoration-none text-dark"
            href="/item/detail/${product.id}" aria-label="${product.title} ${product.price
                } in ${product.location}" tabindex="0">
            <div class="product-subtitle1">
                <p class="product-title m-0 text-no-wrap">
                    ${product.title}
                </p>
                <div class="price-box">
                    <p class="m-0 product-price">$${(product.id * 0.5).toFixed(
                        2
                    )}</p>
                </div>
                <p class="m-0 product-location">Oregon City, O</p>
            </div>
        </a>
    </div>
    `;
    return productElement;
        }

        // Event listener to detect when the user has scrolled to the bottom of the page
        window.addEventListener("scroll", () => {
            const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
            if (scrollTop + clientHeight >= scrollHeight - 5) {
        // Load more products
        loadProducts();
            }
        });

    // Load the initial set of products
    //$(document).ready(function () {
    //    loadProducts();
    //    });
    loadProducts();
