let categories = [];
function loadAPIs() {
    fetch('https://merolikeando.com/api/Extra/GetProvinces')
        .then(response => response.json())
        .then(data => {
            let provincesHTML = '';
            provincesHTML += '<option id="0" value="0">Province</option>'; 
            data.result.forEach(province => {
                provincesHTML += `<option class="filter" title="province" id="${province.id}" value="${province.id}">
            ${province.name}
        </option>`;
            });
            document.getElementById('provinces').innerHTML = provincesHTML;
        })

        .catch(error => console.error(error));

    fetch('https://merolikeando.com/api/Extra/GetCategories')
        .then(response => response.json())
        .then(data => {
            categories = data.result;
            generateCategoryLinks(categories);
            generateOffCanvasCategoryLinks(categories);
    })

        .catch(error => console.error(error));
};


function generateOffCanvasCategoryLinks(categories) {
    const offCanvasCategories = document.getElementById('offCanvasCategories');
    const categoryLinkTemplate = `
    <div class="offcanvas-link">
      <a class="text-dark d-flex align-items-center justify-content-between cursor-pointer text-decoration-none"
        data-bs-toggle="collapse" data-bs-target="#offcanvas-drop-{categoryId}">
        <span class="d-flex align-items-center gap-1">
          <h6 class="mb-0 font-medium">{categoryName}</h6>
        </span>
        <i class="bi bi-chevron-compact-down"></i>
      </a>
      <div id="offcanvas-drop-{categoryId}" class="collapse">
        <ul class="list-unstyled text-white">
          {subCategories}
        </ul>
      </div>
    </div>
  `;

    categories.forEach((category) => {
        let subCategoriesHTML = '';
        category.subCategories.forEach((subCategory) => {
            subCategoriesHTML += `
        <li class="hover-bg-light cursor-pointer">
          <a href="#" class="text-dark text-decoration-none">
            ${subCategory.name}
          </a>
        </li>
      `;
        });

        const categoryLink = categoryLinkTemplate
            .replace(/{categoryId}/g, category.id)
            .replace(/{categoryName}/g, category.name)
            .replace(/{subCategories}/g, subCategoriesHTML);

        offCanvasCategories.innerHTML += categoryLink;
    });
}


function generateCategoryLinks(categories) {
    //debugger
    //console.log(categories);
    const navLinks = document.querySelector('.nav-links');
    const moreBtn = document.querySelector('#more-btn');
    const moreCategory = document.querySelector('.more-Category');

    let num = 0;
    // calculate num based on screen size
    if (window.innerWidth <= 1199) {
        num = 5;
    } else {
        num = 8;
    }
   
    function displayCategories(startIndex) {
        

        navLinks.innerHTML = ''; // clear previous categories


        for (let i = startIndex; i < startIndex + num && i < categories.length; i++) {
            const category = categories[i];
            const catName = category.name;
            const subCategories = category.subCategories;

            const dropdown = document.createElement('li');
            dropdown.classList.add('dropdown');

            const dropbtn = document.createElement('button');
            //dropbtn.setAttribute('value', 'category.id');
            dropbtn.value = category.id;
            dropbtn.setAttribute('onclick', 'setFilters(1, this.value, 0, 0, 0)');
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
                subCatLink.classList = 'pb-0';
                subCatLink.innerHTML = `
                <button class="cusotm-btn" value="${subCategory.id}" onclick="setFilters(2, 0, this.value, 0, 0)">
                ${subCatName}</button>
                `
                //subCatLink.textContent = subCatName;

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
                dropdownHTML += `<li value="${category.id}" onclick="setFilters(1,this.value, 0, 0, 0)">
                                <a class="dropdown-item" value="${category.id}" 
                                href="#">${catName}</a>
                                <ul class="submenu submenu-left dropdown-menu shadow">`;
                subCategories.forEach(subCategory => {
                    const subCatName = subCategory.name;
                    dropdownHTML += `<li value="${subCategory.id}" onclick="setFilters(2, 0, this.value, 0, 0)">
                    <a class="dropdown-item" value="${subCategory.id}" 
                    href="">${subCatName}</a></li>`;
                });

                dropdownHTML += `</ul></li>`;

            }

            document.getElementById('more-content').innerHTML = dropdownHTML;

        } else {
            moreBtn.style.display = 'none';
        }
    }

    displayCategories(0);
}

window.addEventListener("resize", () => {
    if (window.innerWidth >= 1200) {
        generateCategoryLinks(categories);
    }

   else if (window.innerWidth <= 1199) {
        //console.log('less smaller');
        generateCategoryLinks(categories);
    }
 
});

function getMunicipalities(provinceId) {

    fetch(`https://merolikeando.com/api/Extra/GetProvinces`)
        .then(response => response.json())
        .then(data => {
            let municipalitiesHTML = '';
            municipalitiesHTML += '<option id="0" value="0">Municipality</option>'; 
            data.result.forEach(province => {
                let proId = province.id;
                let proMu = province.municipalitiees;
                if (proId == provinceId) {
                    proMu.forEach(municipality => {
                        municipalitiesHTML += `<option id="${municipality.id}"  value="${municipality.id}" >${municipality.name}</option>`;
                    })
                    return;
                }
                else {
                    console.log("no id match");
                }

            });
            document.getElementById('municipalitiees').innerHTML = municipalitiesHTML;
            document.getElementById('municipalitiees').setAttribute('onchange', 'setFilters(4, 0, 0, 0, value);');
        })
        .catch(error => console.error(error));
    //Products Load
    
    setFilters(3, 0, 0, provinceId, 0);

};

function customHover() {
    const moreShow = document.getElementById('more-content');
    moreShow.style.display = 'block';
    moreShow.addEventListener('mouseleave', () => {
        moreShow.style.display = 'none';
    });
};
document.addEventListener("DOMContentLoaded", function () {


    // Prevent closing from click inside dropdown
    document.querySelectorAll('.dropdown-menu').forEach(function (element) {
        element.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });

});

//dummy Product API
//`https://jsonplaceholder.typicode.com/photos?_page=${currentpage}&_limit=${productsperpage}`


let categoryID = 1008;
let subCategoryID = 1010;
let provinceID = 0;
let muncipalityID = 0;
let searchKeyWord = null;

function setFilters(filterType, catid, subcatid, provncid, muncid) {

    //console.log(filterType, catid, subcatid, provncid, muncid);  //To check what we are getting 

    if (filterType === 1) {

        console.log("filter 1");

        if (catid !== 0) {
            categoryID = catid;
            subCategoryID = 0;
        }
    }

    else if (filterType === 2) {
        if (subcatid !== 0) {
            subCategoryID = subcatid;
        }
    }

    else if (filterType === 3) {
        if (provncid !== 0) {
            provinceID = provncid;
            muncipalityID = 0;
        }
    }

    else if (filterType === 4) {
        if (muncid !== 0) {
            muncipalityID = muncid;
        }
    }

    //console.log(categoryID, subCategoryID, provinceID, muncipalityID); //To test ids which are saved at the end
    loadProducts();
}
function searchValueSave(value) {
    if (value != null) {
        searchKeyWord = value;
        categoryID = 0;
        subCategoryID = 0;
        provinceID = 0;
        muncipalityID = 0;
        
    }
    console.log("value saved...", searchKeyWord);
}

function search() {
    loadProducts();
    console.log("i'm search");
}
//document.querySelector('.filter').addEventListener('click', function () {
//    // call the setFilters function here with the arguments you want
//    setFilters(3,0,0,1,0);
//});
function loadProducts() {
    //debugger
    let currentpage = 1;
    const productsperpage = 10;
    // make an ajax call to fetch the products for the current page
        //https://wideredkayak73.conveyor.cloud/api/Product/GetProductsWithOutToken?pageSize=${productsperpage}&pageNumber=${currentpage}

    fetch(
        `https://smallbluewave65.conveyor.cloud/api/Product/GetProductsWithOutTokenByFilters?cat=${categoryID}&subCat=${subCategoryID}&prvnc=${provinceID}&munc=${muncipalityID}&pageSize=${productsperpage}&pageNumber=${currentpage}&search${searchKeyWord}`
    )
    
        .then((response) => response.json())
        .then((data) => {
            console.log("after refetch", categoryID, subCategoryID, provinceID, muncipalityID, searchKeyWord);
            //console.log(data);
            // append the new products to the existing list
            const productscontainer = document.querySelector("#products-container");
            productscontainer.innerHTML = '';
            data.result.forEach((product) => {
                const productElement = createproductelement(product);
                productscontainer.appendChild(productElement);
            });
            // increment the current page number
            currentpage++;
        });
}

 //function to create a product element
function createproductelement(product) {
    
    //debugger
    const productElement = document.createElement("div");
    productElement.classList.add("col-6", "col-md-2", "col-sm-3", "px-2", "mb-3");
    productElement.innerHTML = `
        <div class="product-box d-flex flex-column justify-content-center">

            <div class="product-img-box rounded-1 overflow-hidden">
                <img class="w-100 img-fluid"
                src="${product.image}"
                 />
            </div>
            <a title="${product.title}" class="text-decoration-none text-dark"
            href="${product.link}" aria-label="${product.title} ${product.price} in ${product.location}" tabindex="0">
            <div class="product-subtitle1">
                <p class="product-title m-0 text-no-wrap">
                    ${product.title}
                </p>
                <div class="price-box">
                    <p class="m-0 product-price">$${product.id}</p>
                </div>
                <p class="m-0 product-location">oregon city, o</p>
            </div>
        </a>
    </div>
    `;
    return productElement;

}

window.addEventListener("scroll", () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
        // load more products
        loadProducts();
    }
});

// Load the initial set of products

function storeValue(element) {
    element.setAttribute('value', element.value);
}

function loginUser(event) {
    event.preventDefault();

    const emailInput = document.querySelector('#loginemail');
    const passwordInput = document.querySelector('#loginpassword');
    const email = emailInput.value;
    const password = passwordInput.value;
    const logintype = "Custom";

    axios.post('https://merolikeando.com/api/Auth/Login', {
        email,
        password,
        logintype // replace with the actual type you want to send
    })
        .then(response => {
            const token = response.data;
            sessionStorage.setItem('token', token); // Store the token in sessionStorage
            console.log(token);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function logoutUser() {
    sessionStorage.removeItem('token'); // Remove the token from sessionStorage
    // Redirect the user to the logout page or login page
    console.log(sessionStorage.getItem('token'));
}

$(document).ready(function () {
    loadAPIs();
    loadProducts();
});