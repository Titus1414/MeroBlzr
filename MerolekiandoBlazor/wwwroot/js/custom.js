function loadAPIs() {
    fetch('https://merolikeando.com/api/Extra/GetProvinces')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let provincesHTML = '';
            data.result.forEach(province => {
                provincesHTML += `<option id="${province.id}"  value="${province.id}">${province.name}</option>`;
            });
            document.getElementById('provinces').innerHTML = provincesHTML;

        })
        .catch(error => console.error(error));
    
    fetch('https://merolikeando.com/api/Extra/GetCategories')
        .then(response => response.json())
        .then(data => generateCategoryLinks(data.result))
        .catch(error => console.error(error));


    
};
function generateCategoryLinks(categories) {
    const navLinks = document.querySelector('.nav-links');
    const moreBtn = document.querySelector('#more-btn');
    const moreCategory = document.querySelector('.more-Category');

    let num = 8;

    function displayCategories(startIndex) {
        navLinks.innerHTML = ''; // clear previous categories

        for (let i = startIndex; i < startIndex + num && i < categories.length; i++) {
            const category = categories[i];
            const catName = category.name;
            const subCategories = category.subCategories;

            const dropdown = document.createElement('li');
            dropdown.classList.add('dropdown');

            const dropbtn = document.createElement('button');
            dropbtn.classList.add('dropbtn');

            const catNameSpan = document.createElement('span');
            catNameSpan.classList.add('category-name');
            catNameSpan.textContent = catName.length > 10 ? catName.slice(0, 10) + '...' : catName;
            catNameSpan.setAttribute('data-bs-toggle', 'tooltip');
            catNameSpan.setAttribute('data-placement', 'top');
            catNameSpan.setAttribute('title', catName);

            const catUnderline = document.createElement('span');
            catUnderline.classList.add('jss1949');

            const dropdownContent = document.createElement('div');
            dropdownContent.classList.add('dropdown-content');

            subCategories.forEach(subCategory => {
                const subCatName = subCategory.name;

                const subCatLink = document.createElement('a');
                subCatLink.href = '#';
                subCatLink.textContent = subCatName;

                dropdownContent.appendChild(subCatLink);
            });

            navLinks.appendChild(dropdown);
            dropdown.appendChild(dropbtn);
            dropbtn.appendChild(catNameSpan);
            dropbtn.appendChild(catUnderline);
            dropdown.appendChild(dropdownContent);
        }

        if (startIndex + num < categories.length) {
            let dropdownHTML = '';
            for (let i = startIndex + num; i < categories.length; i++) {
                const category = categories[i];
                const catName = category.name;
                const subCategories = category.subCategories;
                dropdownHTML += `<li>
                                <a class="dropdown-item" href="#">${catName}</a>
                                <ul class="submenu submenu-left dropdown-menu shadow">`;
                subCategories.forEach(subCategory => {
                    const subCatName = subCategory.name;
                    dropdownHTML += `<li><a class="dropdown-item" href="">${subCatName}</a></li>`;
                });

                dropdownHTML += `</ul></li>`;

            }

            document.getElementById('more-content').innerHTML = dropdownHTML;

        } else {
            moreBtn.style.display = 'none';
        }


    }
    displayCategories(0);
};


function getMunicipalities(provinceId) {

    fetch(`https://merolikeando.com/api/Extra/GetProvinces`)
        .then(response => response.json())
        .then(data => {
            let municipalitiesHTML = '';
            data.result.forEach(province => {
                let proId = province.id;
                let proMu = province.municipalitiees;

                if (proId == provinceId) {
                    proMu.forEach(municipality => {
                        municipalitiesHTML += `<option id="${municipality.id}"  value="${municipality.id}">${municipality.name}</option>`;
                    })
                    return;
                }
                else {
                    console.log("no id match");
                }


            });
            document.getElementById('municipalitiees').innerHTML = municipalitiesHTML;
        })
        .catch(error => console.error(error));
    //Products Load
    

};



function customHover() {
    const moreShow = document.getElementById('more-content');
    moreShow.style.display = 'block';
    moreShow.addEventListener('mouseleave', () => {
        moreShow.style.display = 'none';
    });
};
document.addEventListener("DOMContentLoaded", function () {


    /////// Prevent closing from click inside dropdown
    document.querySelectorAll('.dropdown-menu').forEach(function (element) {
        element.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });

});

// Function to fetch the products from the server
//function loadProducts() {
//    let currentPage = 1;
//    const productsPerPage = 12;
//    // Make an AJAX call to fetch the products for the current page
//    fetch(
//        `https://jsonplaceholder.typicode.com/photos?_page=${currentPage}&_limit=${productsPerPage}`
//    )
//        .then((response) => response.json())
//        .then((data) => {
//            // Append the new products to the existing list
//            const productsContainer = document.querySelector("#products-container");
//            data.forEach((product) => {
//                const productElement = createProductElement(product);
//                productsContainer.appendChild(productElement);
//            });

//            // Increment the current page number
//            currentPage++;
//        });
//}

// Function to create a product element
//function createProductElement(product) {
//    //debugger
//    const productElement = document.createElement("div");
//    productElement.classList.add("col-6", "col-md-2", "col-sm-3", "px-2", "mb-3");
//    productElement.innerHTML = `
//        <div class="product-box d-flex flex-column justify-content-center">

//            <div class="product-img-box rounded-1 overflow-hidden">
//                <img class="w-100 img-fluid"
//                src="${product.url}"
//                alt="${product.title}" />
//            </div>
//            <a title="${product.title}" class="text-decoration-none text-dark"
//            href="/item/detail/${product.id}" aria-label="${product.title} ${product.price
//        } in ${product.location}" tabindex="0">
//            <div class="product-subtitle1">
//                <p class="product-title m-0 text-no-wrap">
//                    ${product.title}
//                </p>
//                <div class="price-box">
//                    <p class="m-0 product-price">$${(product.id * 0.5).toFixed(
//            2
//        )}</p>
//                </div>
//                <p class="m-0 product-location">Oregon City, O</p>
//            </div>
//        </a>
//    </div>
//    `;
//    return productElement;
//}

//// Event listener to detect when the user has scrolled to the bottom of the page
//window.addEventListener("scroll", () => {
//    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
//    if (scrollTop + clientHeight >= scrollHeight - 5) {
//        // Load more products
//        loadProducts();
//    }
//});

    // Load the initial set of products


function storeValue(element) {
    element.setAttribute('value', element.value);
}

//function loginUser(event) {
//    event.preventDefault();

//    const emailInput = document.querySelector('#loginemail');
//    const passwordInput = document.querySelector('#loginpassword');
//    const email = emailInput.value;
//    const password = passwordInput.value;

//    const logintype = "Admin";
//    fetch('https://merolikeando.com/api/Auth/Login', {
//        method: 'POST',
//        headers: {
//            'Content-Type': 'application/json'
//        },
//        body: JSON.stringify({
//            email,
//            password,
//            logintype // replace with the actual type you want to send
//        })
//    })
//        .then(response => {
//            if (!response.ok) {
//                console.log(response.json());
//                throw new Error(`Error: ${response.status} ${response.statusText}`);
//            }
//            else {
//                response.json();
//                let data = response; 
//                console.log(response);
//            }
//        })
//        .then(data => {
//            const token = data.token; // store token value in a variable
//            console.log(token); // print token value to console
//            // TODO: store token value in session and remove when session is null
//        })
//        .catch(error => {
//            console.log(error);
//        });
//}

function loginUser(event) {
    event.preventDefault();

    const emailInput = document.querySelector('#loginemail');
    const passwordInput = document.querySelector('#loginpassword');
    const email = emailInput.value;
    const password = passwordInput.value;

    const logintype = "Admin";
    fetch('https://merolikeando.com/api/Auth/Login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password,
            logintype // replace with the actual type you want to send
        })
    })
        .then(response => {
            if (!response.ok) {
                console.log(response.json());
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            else {
                return response.json();
            }
        })
        .then(data => {
            const token = data.token; // store token value in a variable
            console.log(token); // print token value to console
            // TODO: store token value in session and remove when session is null

            // Move the code that needs to use the token inside this block
            // For example, to set a cookie session, you can use this:
            document.cookie = `token=${token}; path=/`;

            // To store the token in local storage, you can use this:
            localStorage.setItem('token', token);
        })
        .catch(error => {
            console.log(error);
        });
}



$(document).ready(function () {
    loadAPIs();
    
    //loadProducts();
});