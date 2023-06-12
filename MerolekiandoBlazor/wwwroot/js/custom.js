let link = 'https://wideorangeshop42.conveyor.cloud/';

let categories = [];
let searchKeyWord = "";
let filterOn = false;
let decryptedTokenValue;
let encryptedToken;
let idOfClickedProduct;
let fvrtCheck = false;
let pagecheck = false;
let currentpage = 1;
const productsperpage = 18;

const loader = document.getElementById('loader');

function showChatButton()
{
    const messageBtn = document.getElementById('open-button');
    messageBtn.classList.remove('d-none');
}
function update() {
    const btnChat = document.getElementById('chatButton');
    const msgBtn = document.getElementById('open-button');

    if (pagecheck && encryptedToken) {
        btnChat.classList.remove('d-none');

    }
    else {
        msgBtn.classList.add('d-none');
        btnChat.classList.add('d-none');
        //hideLoader();
    }
}
//Chat functionality ends
function meroLikeandoClicked() {
    currentpage = 1;
    showLoader();
}

function showLoader() {
    loader.style.display = 'flex';
}

function hideLoader() {
    loader.style.display = 'none';
}

function loadAPIs() {
    //debugger
    showLoader();
    fetch(`${link}api/Extra/GetProvinces`)
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

    fetch(`${link}api/Extra/GetCategories`)
        .then(response => response.json())
        .then(data => {
            categories = data.result;
            generateCategoryLinks(categories);
            generateOffCanvasCategoryLinks(categories);
    })

        .catch(error => console.error(error));
    
    updateLoginStatus();
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
            //dropbtn.setAttribute('value', category.id);
            dropbtn.value = category.id;
            dropbtn.setAttribute('onclick', 'setFilters(1, value, 0, 0, 0)');
            dropbtn.classList.add('dropbtn');

            const catNameSpan = document.createElement('span');
            catNameSpan.classList.add('category-name');
            //catnamespan.value = category.id;
            //catnamespan.setattribute('onclick', 'setfilters(1, value, 0, 0, 0)');
            catNameSpan.textContent = catName.length > 10 ? catName.slice(0, 10) + '...' : catName;
            catNameSpan.setAttribute('data-bs-toggle', 'tooltip');
            catNameSpan.setAttribute('data-placement', 'top');
            catNameSpan.setAttribute('title', catName);

            const catUnderline = document.createElement('span');
            catUnderline.classList.add('jss1949');

            const dropdownContent = document.createElement('div');
            dropdownContent.classList.add('dropdown-content');

            subCategories.forEach(subCategory => {
                const subCatName = subCategory.name.length > 20 ? subCategory.name.slice(0, 20) + '...' : subCategory.name;
                const subCatIdNo = Number(subCategory.id);
                //console.log("this converted subcatid", subCatID);
                const subCatLink = document.createElement('a');
                subCatLink.value = subCatIdNo;
                subCatLink.setAttribute('onclick', `setFilters(2, ${category.id}, value, 0, 0)`);
                //subCatLink.href = '#';
                subCatLink.classList.add = 'py-0', 'cursor-pointer';
                subCatLink.innerHTML = `
                <button class="cusotm-btn" value="${subCatIdNo}">
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
                dropdownHTML += `<li value="${category.id}" >
                                <a class="dropdown-item" value="${category.id}" onclick="setFilters(1,value, 0, 0, 0)"
                                >${catName}</a>
                                <ul class="submenu submenu-left dropdown-menu shadow">`;
                subCategories.forEach(subCategory => {
                    const subCatName = subCategory.name;
                    dropdownHTML += `<li value="${subCategory.id}" onclick="setFilters(2, ${category.id},value, 0, 0)">
                    <a class="dropdown-item" value="${subCategory.id}" 
                    >${subCatName}</a></li>`;
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

    fetch(`${link}api/Extra/GetProvinces`)
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



function loadDefaultProducts() {
    //debugger
    const perpagepro = 18;
    encryptedToken = localStorage.getItem('token');
    localStorage.setItem('productPage', false);
    localStorage.setItem('sellerId', '');
    localStorage.setItem('checkFvrt', false);
    pagecheck = localStorage.getItem('productPage');
    localStorage.setItem('idOfClickedProduct', '');
    localStorage.setItem('clickedProduct', '');
    idOfClickedProduct = localStorage.getItem('clickedProduct');
    fetch(
        `${link}api/Product/GetProductsWithOutToken?pageSize=${perpagepro}&pageNumber=${currentpage}`

    )
        .then((response) => response.json())
        .then((data) => {
            //console.log(data);
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
            hideLoader();
        });
    

}

let categoryID = 0;
let subCategoryID = 0;
let provinceID = 0;
let muncipalityID = 0;
function setFilters(filterType, catid, subcatid, provncid, muncid) {
    showLoader();
    currentpage = 1;
    //console.log(filterType, catid, subcatid, provncid, muncid);  //To check what we are getting 

    // Check if values other than filterType are all zero
    if (filterType !== 0 && catid == 0 && subcatid == 0 && provncid == 0 && muncid == 0) {
        // Run the specific function when all values are zero
        loadDefaultProducts();
    } else {

        if (filterType === 1) {

            console.log("filter 1");

            if (catid !== 0) {
                categoryID = catid;
                subCategoryID = 0;
            }
        }

        else if (filterType === 2) {
            if (subcatid !== 0 && catid !== 0) {
                subCategoryID = subcatid;
                categoryID = catid;
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
    showLoader();
    currentpage = 1;
    const proBox = document.querySelector("#products-container");
    proBox.innerHTML = '';
        loadProducts();
    //console.log("i'm search");
}

function loadProducts()
{
    //debugger
    //let currentpage = 1;
    //const productsperpage = 18;
    filterOn = true;
    console.log("current page", currentpage);
    console.log("Data to send in filter API", categoryID, subCategoryID, provinceID, muncipalityID, searchKeyWord);
    fetch(
        `${link}api/Product/GetProductsWithOutTokenByFilters?cat=${categoryID}&subCat=${subCategoryID}&prvnc=${provinceID}&munc=${muncipalityID}&pageSize=${productsperpage}&pageNumber=${currentpage}&search=${searchKeyWord}`
    )
    
        .then((response) => response.json())
        .then((data) =>
        {
            //console.log("after refetch", categoryID, subCategoryID, provinceID, muncipalityID, searchKeyWord);
            console.log(data);
            const productscontainer = document.querySelector("#products-container");
            if (currentpage == 1)
            {
                productscontainer.innerHTML = '';
            }
            data.result.forEach((product) => {
                const productElement = createproductelement(product);
                productscontainer.appendChild(productElement);
            });
            // increment the current page number
            currentpage++;
            hideLoader();
            
        });
}

 //function to create a product element
function createproductelement(product) {
    
    //debugger
    let productIMG = product.image;
   // if (filterOn === false) {
        const imageUrls = product.prodImages.map((imageObj) => imageObj.image);
        productIMG = "https://merolikeando.com" + imageUrls[0];
        //console.log(productIMG);
    //}
    const productElement = document.createElement("div");
    productElement.classList.add("col-6", "col-md-2", "col-sm-3", "px-2", "mb-3");
    productElement.innerHTML = `
        <div class="product-box d-flex flex-column justify-content-center">

            <div class="product-img-box rounded-1 overflow-hidden">
                <img class="w-100 img-fluid"
                src="${productIMG || ''}"
                 />
            </div>
            <a href="singleproductview" id="${product.id}" title="${product.title}" class="text-decoration-none text-dark" onclick="singleProductDetail(id)"
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
    if (pagecheck !== 'true' && scrollTop + clientHeight >= scrollHeight - 5) {
        //console.log("scroll works ");
        
        if (filterOn === false) {
            showLoader();
            loadDefaultProducts();
        } else {
            showLoader();
            loadProducts();
        }
    }
});


function storeValue(element) {
    element.setAttribute('value', element.value);
}


function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );

    // Parse the JSON string into a JavaScript object
    const tokenObject = JSON.parse(jsonPayload);

    // Access the ID property
    const loginUserID = tokenObject.ID;
    localStorage.setItem('userId', loginUserID);
    
    return JSON.parse(jsonPayload);
   
}

// Save data from sessionStorage to localStorage just before page refresh
window.addEventListener('beforeunload', function () {
    localStorage.setItem('decryptedToken', decryptedTokenValue);
    localStorage.setItem('encryptedToken', encryptedToken);
    localStorage.setItem('clickedProduct', idOfClickedProduct);
    if (pagecheck === 'true') {
        localStorage.setItem('productPage', pagecheck);
    }
    else {
        localStorage.setItem('productPage', pagecheck);
    }
    onReload();
});


// load data on page refresh
window.onload = function () {
    currentpage = 1;
    decryptedTokenValue = localStorage.getItem('decryptedToken');
    encryptedToken = localStorage.getItem('encryptedToken');
    idOfClickedProduct = localStorage.getItem('clickedProduct');
    
    pagecheck = localStorage.getItem('productPage');
    //debugger
    if (pagecheck === 'true')
    {
        //debugger
        singleProductDetail();
        update();
    }
};


function loginUser(event) {
    event.preventDefault();

    const emailInput = document.querySelector('#loginemail');
    const passwordInput = document.querySelector('#loginpassword');
    const email = emailInput.value;
    const password = passwordInput.value;
    const logintype = "Custom";
    if (email && password) {
        showLoader();
        axios.post(`${link}api/Auth/Login`, {
            email,
            password,
            logintype
        })
            .then(response => {
                //console.log(response);
                const token = response.data;
                //console.log(token);
                const decodedToken = parseJwt(token);
                const decryptedToken = JSON.stringify(decodedToken);
                localStorage.setItem('decryptedToken', decryptedToken);
                localStorage.setItem('encryptedToken', token);

                decryptedTokenValue = localStorage.getItem('decryptedToken');
                encryptedToken = localStorage.getItem('encryptedToken');
                //console.log("This is decrypted token:", decryptedToken);

                updateLoginStatus();
                if (pagecheck == 'true') {
                    update();
                    checkIfAlreadyfvrt(encryptedToken);
                }
                
                var modalContainer = document.querySelector('.bm-container');
                if (modalContainer) {
                    modalContainer.remove();
                }
                hideLoader();
                
            })
            .catch(error => {
                console.error('Error:', error);
                hideLoader();
                alert('Incorrect Email or Password');
            });
    }
    else {
        alert('Please Input Email and Password');
    }

    
}



function refreshPage() {
    location.reload();
}



function updateLoginStatus() {
    const loginButton = document.getElementById('loginBtn');
    const logoutButton = document.getElementById('logoutBtn');

    encryptedToken = localStorage.getItem('encryptedToken');

    // Check if the session is expired or removed
    if (encryptedToken == 'null' || encryptedToken == null || encryptedToken == 'undefined' || encryptedToken == undefined || encryptedToken == '') {
        // Session is expired or removed
        loginButton.classList.remove('d-none');
        logoutButton.classList.add('d-none');
        localStorage.setItem('userId', '');
        localStorage.setItem('decryptedToken', '');
        encryptedToken = localStorage.getItem('decryptedToken');

        
    }
    else {
        //console.log("it is not undefined : ", checkToken);
        console.log("login status updated :");
        // Session is active
        loginButton.classList.add('d-none');
        logoutButton.classList.remove('d-none');
        encryptedToken = localStorage.getItem('encryptedToken');
        const decTokenValueCheck = localStorage.getItem('decryptedToken');
        if ((encryptedToken !== 'null' && encryptedToken !== 'undefined') && !decTokenValueCheck) {
            const parsedToken = parseJwt(encryptedToken);
            const decToken = JSON.stringify(parsedToken);
            localStorage.setItem('userId', decToken.ID);
            localStorage.setItem('decryptedToken', decToken);

        }
        if (pagecheck === 'true') {
            checkIfAlreadyfvrt(encryptedToken);

        }
        

    }
}

function logoutUser() {
    showLoader();
    

    sessionStorage.removeItem('decodedToken');
    sessionStorage.removeItem('encryptedToken');
    localStorage.removeItem('token');
    localStorage.removeItem('decryptedToken');
    decryptedTokenValue = localStorage.setItem('decryptedToken', undefined);
    localStorage.removeItem('userId');
    encryptedToken = localStorage.setItem('encryptedToken', undefined);
    fvrtCheck = localStorage.removeItem('checkFvrt'); 
    updateLoginStatus();
    update();
    updateFvrtbtn();
    hideLoader();

}


async function singleProductDetail(id) {
    //debugger
    showLoader();
    localStorage.setItem('productPage', true);
    pagecheck = localStorage.getItem('productPage');
    encryptedToken = localStorage.getItem('encryptedToken');
    let clickedId;
    if (id) {
        clickedId = id;
        localStorage.setItem('clickedProduct', id);
        idOfClickedProduct = localStorage.getItem('clickedProduct');
    }
    else {
        idOfClickedProduct = localStorage.getItem('clickedProduct');
        clickedId = idOfClickedProduct;
        console.log('refresh id check:');
    }

    try {
        const response = await fetch(`${link}api/Product/GetProductsById?id=${clickedId}`);
        const data = await response.json();
        const productDetails = data.result;
        console.log("this is clicked product detail ",productDetails);
        //console.log("clicked id =", clickedId);

        const productTitle = document.getElementById('product-title');
        const productDescr = document.getElementById('product-description');
        const productPrice = document.getElementById('product-price');
        const productPostDate = document.getElementById('posted-date');
        const productCondition = document.getElementById('product-condition');
        const prductSeller = document.getElementById('seller-name');
        const productCat = document.getElementById('product-category');
        const productMainImg = document.getElementById('mainProductImage');
        const fvrt = document.getElementById('product-save');
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
        fvrt.value = clickedId;
        sellerID = productDetails.sellerId;
        categoryID = productDetails.categoryId;
        productID = productDetails.id;
        localStorage.setItem('sellerId', sellerID);
        console.log("seller id :", sellerID);
        console.log("product id : ",productID);
        const sellerName = await getSellerName(sellerID);
        const productCategory = await getSingleProductCategory(categoryID);


        prductSeller.textContent = sellerName;
        productCat.textContent = "Category : " + productCategory;
        const reported = productDetails.isReported;
        if (reported && pagecheck === 'true') {
            reportBtnUpdate(reported);
        }
        else {
            return;
        }
        //debugger
        if (pagecheck === 'true' && (encryptedToken !== null && encryptedToken !== 'null' && encryptedToken !== '' && encryptedToken)) {
            checkIfAlreadyfvrt(encryptedToken);
        }
        else {
            hideLoader();
            return;
        }

    } catch (error)
    {
        console.error('Error:', error);
    }
}
    
async function getSellerName(productID)
{
    const response = await fetch(`${link}api/Auth/GetUsersByIdWithOutToken?id=${productID}`);
    const data = await response.json();
    const sellerName = data.result.name;
    //console.log(sellerName);
    return sellerName;
}

async function getSingleProductCategory(productID)
{
    const response = await fetch(`${link}api/Extra/GetCategoryByIdWOT?id=${productID}`);
    const data = await response.json();
    //console.log("result from category function", data);
    const productCat = data.result.name;
    //console.log(data);
    
    return productCat;
}

//Product Image change onclick
function changeMainImage(button)
{
    const buttons = document.querySelectorAll('.btn-link');
    buttons.forEach((btn) =>
    {
        btn.classList.remove('active');
    });

    button.classList.add('active');

    const imageUrl = button.querySelector('img').src;

    const mainImage = document.getElementById('mainProductImage');
    mainImage.src = imageUrl;
}
function checkIfAlreadyfvrt(token)
{
    //console.log(id, token);
    console.log("inside new func", token);
    //debugger
    if (token)
    {
        axios.get(`${link}api/Product/GetFavProducts`,
        {
                headers:
            {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        })
            .then(response =>
            {
                // Handle the response
                const fvrtRspns = response.data.result;
                //console.log("here in fvrt we can use check disabled :", fvrtRspns);
                //debugger
                const idClicked = parseInt(idOfClickedProduct, 10);
                const result = fvrtRspns.map((element) =>
                {
                    if (element.id === idClicked)
                    {
                        return true;
                    }
                    return false;
                });

                if (result.includes(true))
                {
                    localStorage.setItem('checkFvrt', true);
                    fvrtCheck = localStorage.getItem('checkFvrt');
                    updateFvrtbtn();
                } else
                {
                    localStorage.setItem('checkFvrt', false);
                    fvrtCheck = localStorage.getItem('checkFvrt');
                    updateFvrtbtn();
                }
                //hideLoader();
            })

            .catch(error =>
            {
                // Handle the error
                console.error('Error:', error);
                hideLoader();
            });
    }
    
}


function favourite()
{
    showLoader();
    const id = idOfClickedProduct;
    const token = localStorage.getItem('encryptedToken');
    
    if (!encryptedToken)
    {
        alert('Login First');
        hideLoader();
    }
    
    else
    {
        sendDecryptedToken(id, token);
    }
}          
function sendDecryptedToken(id, token)
{
    console.log(id, token);
    
    axios.post(`${link}api/Auth/SetFavProduct?id=${id}`, null,
    {
            headers:
        {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    })
       
        .catch(error =>
        {
            // Handle the error
            console.error('Error:', error);
        });
    
    checkIfAlreadyfvrt(token);
}
function updateFvrtbtn()
{
    //fvrtCheck =localStorage.getItem('checkFvrt');
    
    favort = fvrtCheck;
    console.log("here what we got from map", favort);
    if (favort === 'true') {
        //console.log('helllllllllo');
        const firstfvrtbtn = document.getElementById('product-save');
        const fvrtbtn = document.getElementById('fvrtBtn');

        firstfvrtbtn.classList.add('text-danger');
        firstfvrtbtn.innerHTML = '';
        firstfvrtbtn.innerHTML += `<i class="bi bi-heart text-danger me-1"></i>UnSave`;
        fvrtbtn.classList.remove('bg-disable');
        fvrtbtn.classList.add('bg-light');
        fvrtbtn.classList.remove('text-dark');
        fvrtbtn.classList.add('text-danger');
        fvrtbtn.innerHTML = '';
        fvrtbtn.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" class="bi bi-heart text-danger" width="13" height="13" id="fvrtBtnIcon"
                             fill="currentColor" viewBox="0 0 16 16">
                            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                        </svg>
                        UnSave`;
    }
    else
    {
        const firstfvrtbtn = document.getElementById('product-save');
        const fvrtbtn = document.getElementById('fvrtBtn');

        firstfvrtbtn.classList.remove('text-danger');
        firstfvrtbtn.innerHTML = '';
        firstfvrtbtn.innerHTML += `<i class="bi bi-heart text-success me-1"></i>Save`;
        fvrtbtn.classList.add('bg-disable');
        fvrtbtn.classList.remove('bg-light');
        fvrtbtn.classList.remove('text-danger');
        fvrtbtn.classList.add('text-dark');
        fvrtbtn.innerHTML = '';
        fvrtbtn.innerHTML = '';
        fvrtbtn.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" class="bi bi-heart" width="13" height="13" id="fvrtBtnIcon"
                             fill="currentColor" viewBox="0 0 16 16">
                            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                        </svg>
                        Save`;
    }
}

async function sendProductReport()
{
    showLoader();
    token = encryptedToken;
    const apiUrl = `${link}api/Product/ProductReport`;
    const requestData =
    {
        id: idOfClickedProduct,
        isReport: true
    };

    try
    {
        const response = await axios.post(apiUrl, requestData,
        {
            headers:
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });

        const responseData = response.data;
        console.log(responseData.result);
        const isReport = responseData.result.isReported;
        console.log(isReport);

        if (isReport)
        {
            reportBtnUpdate(isReport);
            console.log('The report is true');
            hideLoader();
        } else {
            console.log('The report is false');
            hideLoader();
        }
    } catch (error)
    {
        console.error('Error:', error);
        hideLoader();

    }
}

function reportBtnUpdate(isReport)
{
    const btnToDisable = document.getElementById('reportBtn');
    const disabledBtn = document.getElementById('reportDisabled');
 
    if (isReport)
    {
        btnToDisable.classList.add('d-none');
        disabledBtn.classList.remove('d-none');
        disabledBtn.classList.add('d-block');

    }
}


