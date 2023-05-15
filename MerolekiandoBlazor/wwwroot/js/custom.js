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
        

        navLinks.innerHTML = ''; 


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


let currentpage = 1;
const productsperpage = 18;
function loadDefaultProducts() {
    fetch(
        `https://smallbluebook74.conveyor.cloud/api/Product/GetProductsWithOutToken?pageSize=${productsperpage}&pageNumber=${currentpage}`

    )
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            // append the new products to the existing list
            const productscontainer = document.querySelector("#products-container");
            //productscontainer.innerHTML = '';
            data.result.forEach((product) => {
                const productElement = createproductelement(product);
                productscontainer.appendChild(productElement);
            });
            // increment the current page number
            currentpage++;
            //console.log(currentpage);
        });

}



let categoryID = 0;
let subCategoryID = 0;
let provinceID = 0;
let muncipalityID = 0;
let searchKeyWord = null;
let filterOn = false;

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

function loadProducts() {
    //debugger
    //let currentpage = 1;
    //const productsperpage = 18;
    filterOn = true;

    fetch(
        `https://smallbluewave65.conveyor.cloud/api/Product/GetProductsWithOutTokenByFilters?cat=${categoryID}&subCat=${subCategoryID}&prvnc=${provinceID}&munc=${muncipalityID}&pageSize=${productsperpage}&pageNumber=${currentpage}&search${searchKeyWord}`
    )
    
        .then((response) => response.json())
        .then((data) => {
            console.log("after refetch", categoryID, subCategoryID, provinceID, muncipalityID, searchKeyWord);
            //console.log(data);
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
    let productIMG = product.image;
    if (filterOn === false) {
        const imageUrls = product.prodImages.map((imageObj) => imageObj.image);
        productIMG = "https://merolikeando.com" + imageUrls[0];
        //console.log(productIMG);
    }
    const productElement = document.createElement("div");
    productElement.classList.add("col-6", "col-md-2", "col-sm-3", "px-2", "mb-3");
    productElement.innerHTML = `
        <div class="product-box d-flex flex-column justify-content-center">

            <div class="product-img-box rounded-1 overflow-hidden">
                <img class="w-100 img-fluid"
                src="${productIMG}"
                 />
            </div>
            <a id = "${product.id}" title="${product.title}" class="text-decoration-none text-dark"  onclick="singleProductDetail(id)"
            href="singleproductview" aria-label="${product.title} ${product.price} in ${product.location}" tabindex="0">
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
        //console.log("scroll works ");
        
        if (filterOn === false) {
            loadDefaultProducts();
        } else {
            loadProducts();
        }
    }
});


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
        Custom
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


async function singleProductDetail(clickedId) {
    try {
        const response = await fetch(`https://smallbluebook74.conveyor.cloud/api/Product/GetProductsById?id=${clickedId}`);
        const data = await response.json();
        const productDetails = data.result;
        console.log("clicked id =", clickedId);

        const productTitle = document.getElementById('product-title');
        const productDescr = document.getElementById('product-description');
        const productPrice = document.getElementById('product-price');
        const productPostDate = document.getElementById('posted-date');
        const productCondition = document.getElementById('product-condition');
        const prductSeller = document.getElementById('seller-name');
        const productCat = document.getElementById('product-category');
        const productMainImg = document.getElementById('mainProductImage');
        const imageUrls = productDetails.prodImages.map((imageObj) => imageObj.image);
        productMainImg.src = "https://merolikeando.com" + imageUrls[0];

        const imageButtonsContainer = document.getElementById('prodimgsbox');
        imageUrls.forEach((imageUrl, index) => {
            const button = document.createElement('button');
            button.classList.add('btn', 'btn-link', 'rounded', 'overflow-hidden', 'p-0');
            if (index === 0) {
                button.classList.add('active');
            }
            button.onclick = function () {
                changeMainImage(this);
            };

            const image = document.createElement('img');
            image.src = "https://merolikeando.com" + imageUrl;
            image.style.maxHeight = '50px';
            image.style.maxWidth = '50px';
            image.alt = '';

            button.appendChild(image);
            imageButtonsContainer.appendChild(button);
        });

        productTitle.textContent = productDetails.title;
        productDescr.textContent = productDetails.description;
        productPrice.textContent = "$" + productDetails.price;
        productPostDate.textContent = "Posted Date: " + productDetails.createdDate;
        productCondition.textContent = "Condition: " + productDetails.condition;

        productID = productDetails.id;
        console.log(productID);
        const sellerName = await getSellerName(clickedId);
        const productCategory = await getSingleProductCategory(clickedId);

        prductSeller.textContent = sellerName;
        //console.log('Hey, I am seller', sellerName);
        productCat.textContent = "Category : " + productCategory;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getSellerName(productID) {
    const response = await fetch(`https://smallbluebook74.conveyor.cloud/api/Auth/GetUsersByIdWithOutToken?id=${productID}`);
    const data = await response.json();
    const sellerName = data.result.name;
    console.log(sellerName);
    return sellerName;
}

async function getSingleProductCategory(productID) {
    const response = await fetch(`https://smallbluebook74.conveyor.cloud/api/Extra/GetCategoryByIdWOT?id=${productID}`);
    const data = await response.json();
    const productCat = data.result.name;
    console.log(data);
    return productCat;
}

//Product Image change onclick
function changeMainImage(button) {
    const buttons = document.querySelectorAll('.btn-link');
    buttons.forEach((btn) => {
        btn.classList.remove('active');
    });

    button.classList.add('active');

    const imageUrl = button.querySelector('img').src;

    const mainImage = document.getElementById('mainProductImage');
    mainImage.src = imageUrl;
}

