// Function to load pages dynamically
function loadPage(page) {
    // Check if the requested page is 'browse'
    if (page === 'browse') {
        // Make an AJAX request to the API
        fetch('https://little-treasures-backend.onrender.com/shoping_app/browse')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Check if 'products_data' is defined in the response
                if (data && data.products_data) {
                    // Build HTML content based on the API response
                    let productsHtml = '<h2>Browse Products</h2>';
                    productsHtml += '<div class="row">';
                    
                    // Loop through the products_data array in the response
                    data.products_data.forEach(product => {
                        productsHtml += `
                        <div class="col-md-4">
                        <div class="card mb-4 box-shadow">
                            <img class="card-img-top" src="data:image/png;base64,${product.image}" alt="${product.name}">
                            <div class="card-body">
                                <h3>${product.name}</h3>
                                <p class="card-text">${product.description}</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span class="price">$${product.price.toFixed(2)}</span>
                                        
                                        <!-- Add to Cart button -->
                                        <button class="btn btn-primary" onclick="addToCart('${product.name}')">Add to Cart</button>
                                        
                                        <!-- Add to Wishlist button -->
                                        <button class="btn btn-secondary" onclick="addToWishlist('${product.name}')">Add to Wishlist</button>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    });
                    
                    productsHtml += '</div>';

                    // Update the content div with the built HTML
                    document.getElementById('content').innerHTML = productsHtml;
                } else {
                    // Handle the case where 'products_data' is not present in the response
                    document.getElementById('content').innerHTML = '<p>No product data available.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                document.getElementById('content').innerHTML = '<p>Error loading products. Please try again later.</p>';
            });
    }
    else if(page === 'login') {
        fetch(`${page}.html`)
        .then(response => response.text())
        .then(content => {
            // Insert the content into the 'content' div
            document.getElementById('content').innerHTML = content;
        });
    }
    else if (page === 'cart') {
        // Fetch the cart data using the bearer token
        const token = localStorage.getItem('little-treasures-token');
        fetch('https://little-treasures-backend.onrender.com/shoping_app/view-cart', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(cartData => {
                // Check if 'products' is defined in the response and there are products in the cart
                if (cartData && cartData.products && cartData.products.length > 0) {
                    // Build HTML content based on the cart data
                    let cartHtml = '<h2>Shopping Cart</h2>';
                    cartHtml += '<div class="row">';
    
                    // Loop through the products array in the response
                    cartData.products.forEach(product => {
                        cartHtml += `
                        <div class="col-md-4">
                            <div class="card mb-4 box-shadow">
                                <img class="card-img-top" src="data:image/png;base64,${product.image}" alt="${product.name}">
                                <div class="card-body">
                                    <h3>${product.name}</h3>
                                    <p class="card-text">${product.description}</p>
                                    <p class="card-text">$${product.price.toFixed(2)}</p>
                                    <p class="card-text">Quantity: ${product.quantity}</p>
                                </div>
                            </div>
                        </div>`;
                    });
    
                    cartHtml += '</div>';
    
                    // Add a Checkout button
                    cartHtml += '<button class="btn btn-primary" onclick="redirectToCheckout()">Checkout</button>';
    
                    // Add a Delete Cart button
                    cartHtml += '<button class="btn btn-danger" onclick="deleteCart()">Delete Cart</button>';

                    // Update the content div with the built HTML
                    document.getElementById('content').innerHTML = cartHtml;
                } else {
                    // Handle the case where 'products' is not present or the cart is empty
                    document.getElementById('content').innerHTML = '<p>Your cart is empty.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching cart data:', error);
                document.getElementById('content').innerHTML = '<p>Error loading cart. Please try again later.</p>';
            });
    }
    else if (page === 'wishlist') {
        // Fetch the wishlist data using the bearer token
        const token = localStorage.getItem('little-treasures-token');
        fetch('https://little-treasures-backend.onrender.com/shoping_app/view-wishlist', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(wishlistData => {
                // Check if 'products' is defined in the response and there are products in the wishlist
                if (wishlistData && wishlistData.products && wishlistData.products.length > 0) {
                    // Build HTML content based on the wishlist data
                    let wishlistHtml = '<h2>Wishlist</h2>';
                    wishlistHtml += '<div class="row">';
    
                    // Loop through the products array in the response
                    wishlistData.products.forEach(product => {
                        wishlistHtml += `
                        <div class="col-md-4">
                            <div class="card mb-4 box-shadow">
                                <img class="card-img-top" src="data:image/png;base64,${product.image}" alt="${product.name}">
                                <div class="card-body">
                                    <h3>${product.name}</h3>
                                    <p class="card-text">${product.description}</p>
                                    <p class="card-text">$${product.price.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>`;
                    });
    
                    wishlistHtml += '</div>';
    
                    // Update the content div with the built HTML
                    document.getElementById('content').innerHTML = wishlistHtml;
                } else {
                    // Handle the case where 'products' is not present or the wishlist is empty
                    document.getElementById('content').innerHTML = '<p>Your wishlist is empty.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching wishlist data:', error);
                document.getElementById('content').innerHTML = '<p>Error loading wishlist. Please try again later.</p>';
            });
    }
    else if(page === "orderhistory") {
        const token = localStorage.getItem('little-treasures-token');
        fetch('https://little-treasures-backend.onrender.com/shoping_app/order-history', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(orderHistoryData => {
            if (orderHistoryData && orderHistoryData.order_history) {
                // Build HTML content based on the order history data
                const orderHistoryHtml = orderHistoryData.order_history.map(order => {
                    const orderItemsHtml = order.order_list.map(item => `
                        <div class="order-item">
                            <img class="item-image img-fluid" src="data:image/png;base64,${item.image}" alt="${item.name}">
                            <div class="item-details">
                                <h3>${item.name}</h3>
                                <p>${item.description}</p>
                                <p>Quantity: ${item.quantity}</p>
                                <p>Amount: $${item.amount.toFixed(2)}</p>
                            </div>
                        </div>`
                    ).join('');

                    return `
                        <div class="order-container">
                            ${orderItemsHtml}
                            <div class="total-cost">
                                <p>Total Cost: $${order.total_cost.toFixed(2)}</p>
                                <hr> <!-- Separating line -->
                            </div>
                        </div>`;
                }).join('');

                // Update the content div with the built HTML
                document.getElementById('content').innerHTML = `
                    <h2>Order History</h2>
                    ${orderHistoryHtml || '<p>No order history available.</p>'}`;
            } else {
                document.getElementById('content').innerHTML = '<p>No order history available.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching order history:', error);
            document.getElementById('content').innerHTML = '<p>Error loading order history. Please try again later.</p>';
        });
    }        
    else {
        // For other pages, load the page content as before
        fetch(`${page}.html`)
            .then(response => response.text())
            .then(content => {
                document.getElementById('content').innerHTML = content;
            })
            .catch(error => {
                console.error('Error fetching page content:', error);
                document.getElementById('content').innerHTML = '<p>Error loading page. Please try again later.</p>';
            });
    }
}


// Function to handle cart deletion
function deleteCart() {
    const token = localStorage.getItem('little-treasures-token');
    fetch('https://little-treasures-backend.onrender.com/shoping_app/add-to-cart', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Refresh the page after successful cart deletion
            location.reload();
        })
        .catch(error => {
            console.error('Error deleting cart:', error);
            // Handle the error as needed
        });
}


// Function to load the checkout page
function loadCheckoutPage() {
    // Fetch the checkout data using the bearer token
    const token = localStorage.getItem('little-treasures-token');
    fetch('https://little-treasures-backend.onrender.com/shoping_app/checkout', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(checkoutData => {
        // Check if 'products' and 'total_amount' are defined in the response
        if (checkoutData && checkoutData.products && checkoutData.total_amount) {
            // Build HTML content based on the checkout data
            let checkoutHtml = '<h2>Checkout</h2>';
            checkoutHtml += '<div class="row">';
            
            // Loop through the products array in the response
            checkoutData.products.forEach(product => {
                checkoutHtml += `
                    <div class="col-md-4">
                        <div class="card mb-4 box-shadow">
                            <img class="card-img-top" src="data:image/png;base64,${product.image}" alt="${product.name}">
                            <div class="card-body">
                                <h3>${product.name}</h3>
                                <p class="card-text">${product.description}</p>
                                <p class="card-text">Quantity: ${product.quantity}</p>
                                <p class="card-text">Amount: $${product.amount.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>`;
            });
            
            checkoutHtml += '</div>';

            // Display total amount
            checkoutHtml += `<p>Total Amount: $${checkoutData.total_amount.toFixed(2)}</p>`;

            // Update the content div with the built HTML
            document.getElementById('checkout-content').innerHTML = checkoutHtml;
        } else {
            // Handle the case where 'products' or 'total_amount' is not present in the response
            document.getElementById('checkout-content').innerHTML = '<p>Error loading checkout information. Please try again later.</p>';
        }
    })
    .catch(error => {
        console.error('Error fetching checkout data:', error);
        document.getElementById('checkout-content').innerHTML = '<p>Error loading checkout. Please try again later.</p>';
    });
}

// Function to redirect to the checkout page
function redirectToCheckout() {
    window.location.href = 'checkout.html';
}



// Function to add a product to the cart
function addToCart(productName) {
    // Retrieve the Bearer token from local storage
    console.log(productName)
    const token = localStorage.getItem('little-treasures-token');
    console.log(token);
    fetch('https://little-treasures-backend.onrender.com/shoping_app/add-to-cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the Bearer token in the header
        },
        body: JSON.stringify({
            name: productName,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add to cart.');
        }
        return response.json();
    })
    .then(data => {
        console.log('Added to cart:', data);
        // Optionally, you can provide feedback to the user (e.g., show a success message)
        alert('Product added to cart');
    })
    .catch(error => {
        console.error('Add to cart error:', error);
        // Handle error (e.g., display an error message to the user)
    });
}

// Function to add a product to the wishlist
function addToWishlist(productName) {
    // Retrieve the Bearer token from local storage
    const token = localStorage.getItem('little-treasures-token');

    fetch('https://little-treasures-backend.onrender.com/shoping_app/add-to-wishlist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the Bearer token in the header
        },
        body: JSON.stringify({
            name: productName,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add to wishlist.');
        }
        return response.json();
    })
    .then(data => {
        console.log('Added to wishlist:', data);
        // Optionally, you can provide feedback to the user (e.g., show a success message)
        alert("Product added to wishlst")
    })
    .catch(error => {
        console.error('Add to wishlist error:', error);
        // Handle error (e.g., display an error message to the user)
    });
}


function addProduct() {
    // Retrieve the Bearer token from local storage
    const token = localStorage.getItem('little-treasures-token');

    // Get form data
    const name = document.getElementById('name').value;
    const price = parseFloat(document.getElementById('price').value);
    const description = document.getElementById('description').value;
    const imageInput = document.getElementById('image');
    const image = imageInput.files[0]; // Assuming you only want to upload one image

    // Convert image to base64
    const reader = new FileReader();
    reader.onloadend = function () {
        const base64Image = reader.result.split(',')[1];

        // Send data to the server
        fetch('https://little-treasures-backend.onrender.com/shoping_app/add-product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: name,
                price: price,
                description: description,
                image: base64Image,
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add product.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Product added:', data);
            // Optionally, provide feedback to the user (e.g., show a success message)
            window.location.href = '/';
        })
        .catch(error => {
            console.error('Add product error:', error);
            // Handle error (e.g., display an error message to the user)
        });
    };

    // Read the image as a data URL
    reader.readAsDataURL(image);
}



// Function to handle login
function login() {
    // Get email and password from the login form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Step 1: Submit email and password to the login API
    fetch('https://little-treasures-backend.onrender.com/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed. Please check your email and password.');
        }
        return response.json();
    })
    .then(data => {
        // Assuming the API returns an 'otp_required' property
        if (data.otp_required) {
            // If OTP is required, show the OTP input box
            showOtpInput();
        } else {
            // If OTP is not required, you can handle the successful login here
            handleSuccessfulLogin();
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        // Handle login error (e.g., display an error message)
        document.getElementById('login-error').innerText = 'Login failed. Please check your email and password.';
    });
}

// Function to handle OTP submission
function submitOtp() {
    // Get email and OTP from the OTP form
    const email = document.getElementById('email').value;
    const otp = document.getElementById('otp').value;

    // Step 2: Submit email and OTP to the second login API
    fetch('https://little-treasures-backend.onrender.com/users/login', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            otp: otp,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('OTP verification failed. Please check your OTP.');
        }
        return response.json();
    })
    .then(data => {
        // Store the token in local storage
        localStorage.setItem('little-treasures-token', data.token);

        // Redirect to the browse page or any other page as needed
        window.location.href = '/';
    })
    .catch(error => {
        console.error('OTP verification error:', error);
        // Handle OTP verification error (e.g., display an error message)
        document.getElementById('otp-error').innerText = 'OTP verification failed. Please check your OTP.';
    });
}

// Function to show the OTP input box
function showOtpInput() {
    // Hide the password input box
    document.getElementById('password-container').style.display = 'none';

    // Show the OTP input box
    document.getElementById('otp-container').style.display = 'block';
}

// Function to handle successful login (customize this according to your needs)
function handleSuccessfulLogin() {
    // For example, you can redirect to a dashboard or display a success message
    document.getElementById('login-success').innerText = 'Login successful! Redirecting...';
    setTimeout(() => {
        // Redirect or perform additional actions after successful login
        // window.location.href = '/login';
        document.getElementById('login-button').style.display = 'none'; // Hide the email and password form
        document.getElementById('otp-container').style.display = 'block';
        document.getElementById('login-success').innerText = 'Login successful! Enter OTP:';
        document.getElementById('password-container').style.display = 'none'; // Hide the password input
    }, 2000);
}


// script.js

// Function to handle user registration
function register() {
    // Get user registration data from the registration form
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const reenteredPassword = document.getElementById('reenteredPassword').value;

    // Step 1: Submit user registration data to the first registration API
    fetch('https://little-treasures-backend.onrender.com/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            reenteredPassword: reenteredPassword,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Registration failed. Please check your registration details.');
        }
        return response.json();
    })
    .then(data => {
        // Registration successful, hide initial fields
        document.getElementById('name-container').style.display = 'none';
        document.getElementById('password-container').style.display = 'none';
        document.getElementById('reenteredPassword-container').style.display = 'none';
        document.getElementById('register-button-container').style.display = 'none';

        // Show OTP-related fields
        document.getElementById('otp-container').style.display = 'block';
        // document.getElementById('submitOtp').style.display = 'block';
        document.getElementById('otp-button-container').style.display = 'block';
    })
    .catch(error => {
        console.error('Registration error:', error);
        // Handle registration error (e.g., display an error message)
        document.getElementById('registration-error').innerText = 'Registration failed. Please check your details and try again.';
    });
}



// Load the 'home' page by default
loadPage('browse');
