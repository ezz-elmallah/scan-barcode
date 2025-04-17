// Simulated product database (barcode -> product info)
const productsDB = {
  "123456789012": { name: "Apple Juice", price: 3.99 },
  "987654321098": { name: "Chocolate Bar", price: 1.99 },
  "456789123456": { name: "Pasta Pack", price: 2.49 },
};

// List to store scanned products
let scannedProducts = [];

document.getElementById("start-scan").addEventListener("click", startScanner);

function startScanner() {
  const video = document.getElementById("scanner");
  const error = document.getElementById("error");
  error.style.display = "none";
  video.style.display = "block";

  // Initialize QuaggaJS
  Quagga.init({
      inputStream: {
          name: "Live",
          type: "LiveStream",
          target: video,
          constraints: {
              facingMode: "environment", // Use back camera on phones
          },
      },
      decoder: {
          readers: ["ean_reader", "upc_reader"], // Support common barcode types
      },
  }, (err) => {
      if (err) {
          error.textContent = "Error accessing camera: " + err.message;
          error.style.display = "block";
          return;
      }
      Quagga.start();
  });

  // Handle barcode detection
  Quagga.onDetected((data) => {
      const barcode = data.codeResult.code;
      addProduct(barcode);
      Quagga.stop();
      video.style.display = "none";
  });
}

function addProduct(barcode) {
  const error = document.getElementById("error");
  error.style.display = "none";

  // Check if barcode exists in database
  if (productsDB[barcode]) {
      scannedProducts.push({ ...productsDB[barcode], barcode });
      updateProductList();
  } else {
      error.textContent = "Product not found for barcode: " + barcode;
      error.style.display = "block";
  }
}

function updateProductList() {
  const productList = document.getElementById("products");
  const totalElement = document.getElementById("total");
  productList.innerHTML = "";

  // Add each product to the list
  scannedProducts.forEach((product) => {
      const li = document.createElement("li");
      li.textContent = `${product.name} - $${product.price.toFixed(2)}`;
      productList.appendChild(li);
  });

  // Calculate and display total
  const total = scannedProducts.reduce((sum, product) => sum + product.price, 0);
  totalElement.textContent = `Total: $${total.toFixed(2)}`;
}