// Store restaurant inventory data
let foodInventory = {};
let selectedRestaurant = null;

// Function to register/login a restaurant
function addRestaurant() {
    const restaurantInput = document.getElementById("restaurantName").value.trim();
    if (!restaurantInput) {
        alert("Please enter a restaurant name.");
        return;
    }

    selectedRestaurant = restaurantInput;

    if (!foodInventory[selectedRestaurant]) {
        foodInventory[selectedRestaurant] = [];
    }

    document.getElementById("currentRestaurant").innerText = selectedRestaurant;
    document.getElementById("login-section").style.display = "none";
    document.getElementById("inventory-section").style.display = "block";

    displayInventory();
    displayDonations();
}

// Function to logout
function logout() {
    selectedRestaurant = null;
    document.getElementById("restaurantName").value = "";
    document.getElementById("login-section").style.display = "block";
    document.getElementById("inventory-section").style.display = "none";
}

// Function to add food items
function addFood() {
    if (!selectedRestaurant) {
        alert("You must log in first.");
        return;
    }

    const foodName = document.getElementById("foodName").value.trim();
    const expiry = document.getElementById("expiryDate").value;
    const quantity = parseInt(document.getElementById("quantity").value, 10);

    if (!foodName || !expiry || isNaN(quantity) || quantity <= 0) {
        alert("Please enter valid food details.");
        return;
    }

    foodInventory[selectedRestaurant].push({ name: foodName, expiry, quantity, donated: false });

    document.getElementById("foodName").value = "";
    document.getElementById("expiryDate").value = "";
    document.getElementById("quantity").value = "";

    displayInventory();
}

// Function to display the inventory for the logged-in restaurant
function displayInventory() {
    const foodList = document.getElementById("foodList");
    foodList.innerHTML = "";

    if (foodInventory[selectedRestaurant]) {
        foodInventory[selectedRestaurant].forEach((food, index) => {
            const foodItem = document.createElement("div");
            foodItem.classList.add("food-item");

            foodItem.innerHTML = `
                <strong>${food.name}</strong> (Qty: ${food.quantity})<br>
                <span>Expiry: ${food.expiry}</span><br>
            `;

            if (!food.donated) {
                const donateBtn = document.createElement("button");
                donateBtn.innerText = "Donate";
                donateBtn.onclick = () => donateFood(index);
                foodItem.appendChild(donateBtn);
            } else {
                foodItem.innerHTML += `<span>Donated</span>`;
            }

            foodList.appendChild(foodItem);
        });
    }
}

// Function to donate food
function donateFood(index) {
    if (foodInventory[selectedRestaurant] && foodInventory[selectedRestaurant][index]) {
        foodInventory[selectedRestaurant][index].donated = true;
        displayInventory();
        displayDonations();
    }
}

// Function to display donated food for the logged-in restaurant
function displayDonations() {
    const donationList = document.getElementById("donationList");
    donationList.innerHTML = "";

    if (foodInventory[selectedRestaurant]) {
        foodInventory[selectedRestaurant].forEach((food, index) => {
            if (food.donated) {
                const donationItem = document.createElement("div");
                donationItem.classList.add("food-item");

                const expiryDate = new Date(food.expiry);
                const today = new Date();

                if (expiryDate < today) {
                    donationItem.classList.add("expired");
                    donationItem.innerHTML = `
                        <strong>${food.name}</strong> (Qty: ${food.quantity})<br>
                        <span>Expired on: ${food.expiry} - <b>Dispose</b></span><br>
                    `;
                } else {
                    donationItem.innerHTML = `
                        <strong>${food.name}</strong> (Qty: ${food.quantity})<br>
                        <span>Expiry: ${food.expiry}</span><br>
                    `;

                    const claimBtn = document.createElement("button");
                    claimBtn.innerText = "Claim";
                    claimBtn.onclick = () => claimFood(index);
                    donationItem.appendChild(claimBtn);
                }

                donationList.appendChild(donationItem);
            }
        });
    }
}

// Function to claim food
function claimFood(index) {
    if (foodInventory[selectedRestaurant] && foodInventory[selectedRestaurant][index]) {
        alert(`You claimed ${foodInventory[selectedRestaurant][index].name}`);
        foodInventory[selectedRestaurant].splice(index, 1);
        displayInventory();
        displayDonations();
    }
}

// Ensure the UI updates properly
displayInventory();
displayDonations();
