// ================== CONFIG ==================
const SHEET_API = "https://sheetdb.io/api/v1/i7exoujw69dgx";

// Order numbers
const WHATSAPP = "8801957390208";
const IMO = "8801815849575";

// Delivery charge
const DELIVERY_DHAKA = 60;
const DELIVERY_OUT = 120;

// ================== GLOBAL ==================
let products = [];
let currentProduct = null;
let currentQty = 1;

// ================== LOAD DATA ==================
fetch(SHEET_API)
  .then(res => res.json())
  .then(data => {
    // শুধু active product নিবে
    products = data.filter(p => p.active === "TRUE");
    renderCategories();
    renderProducts("All");
  })
  .catch(err => {
    console.error("Sheet load error:", err);
  });

// ================== CATEGORY ==================
function renderCategories() {
  const catDiv = document.getElementById("categories");
  const categories = [...new Set(products.map(p => p.category))];

  let html = `<button onclick="renderProducts('All')">All</button>`;
  categories.forEach(cat => {
    html += `<button onclick="renderProducts('${cat}')">${cat}</button>`;
  });

  catDiv.innerHTML = html;
}

// ================== PRODUCTS ==================
function renderProducts(category) {
  const productDiv = document.getElementById("products");

  const filtered = products.filter(p =>
    category === "All" || p.category === category
  );

  productDiv.innerHTML = filtered.map(p => `
    <div class="product">
      <img src="${p.image_url}" alt="${p.name}" style="width:100%">
      <h4>${p.name}</h4>
      <p>${p.price}৳</p>
      <button onclick="openPopup('${p.name}', ${p.price})">
        অর্ডার করুন
      </button>
    </div>
  `).join("");
}

// ================== POPUP ==================
function openPopup(name, price) {
  currentProduct = { name, price };
  currentQty = 1;

  document.getElementById("popup").style.display = "block";
  document.getElementById("delivery").value = DELIVERY_DHAKA;
  updateTotal();
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

// ================== QUANTITY ==================
function qtyPlus() {
  currentQty++;
  updateTotal();
}

function qtyMinus() {
  if (currentQty > 1) {
    currentQty--;
    updateTotal();
  }
}

// ================== TOTAL ==================
function updateTotal() {
  const delivery = parseInt(document.getElementById("delivery").value);
  const total = (currentProduct.price * currentQty) + delivery;

  document.getElementById("total").innerText =
    `মোট: ${total} টাকা (পরিমাণ: ${currentQty})`;
}

document.addEventListener("change", function (e) {
  if (e.target && e.target.id === "delivery") {
    updateTotal();
  }
});

// ================== ORDER MESSAGE ==================
function buildMessage() {
  const name = document.getElementById("custName").value;
  const phone = document.getElementById("custPhone").value;
  const address = document.getElementById("custAddress").value;
  const delivery = document.getElementById("delivery").value;

  const deliveryText =
    delivery == DELIVERY_DHAKA
      ? "Dhaka City (60৳)"
      : "Outside Dhaka (120৳)";

  const total =
    (currentProduct.price * currentQty) + parseInt(delivery);

  return `
Shop: Modebd

Product: ${currentProduct.name}
Qty: ${currentQty}
Price: ${currentProduct.price}৳

Delivery: ${deliveryText}
Total: ${total}৳

Name: ${name}
Phone: ${phone}
Address: ${address}
`.trim();
}

// ================== WHATSAPP ==================
function orderWA() {
  const msg = buildMessage();
  window.open(
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
}

// ================== IMO ==================
function orderIMO() {
  const msg = buildMessage();
  alert("IMO এ পাঠানোর আগে নিচের লেখা কপি করুন:\n\n" + msg);
  window.open(`https://imo.im/?chat=${IMO}`, "_blank");
}

// ================== SCROLL ==================
function scrollToProducts() {
  document
    .getElementById("products")
    .scrollIntoView({ behavior: "smooth" });
}
function renderHomeSections() {
  const container = document.getElementById("home-sections");
  const categories = [...new Set(products.map(p => p.category))];

  container.innerHTML = categories.map(cat => {
    const items = products.filter(p => p.category === cat).slice(0, 4);

    return `
      <section class="section">
        <div class="section-title">
          <h3>${cat}</h3>
          <button onclick="renderProducts('${cat}')">See More</button>
        </div>
        <div class="products">
          ${items.map(p => `
            <div class="product">
              <img src="${p.image_url}">
              <h4>${p.name}</h4>
              <p>৳ ${p.price}</p>
              <button onclick="openPopup('${p.name}', ${p.price})">
                Add to Cart
              </button>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }).join("");
}

// call after data load
renderHomeSections();
