// ================= CONFIG =================
const SHEET_API = "https://sheetdb.io/api/v1/i7exoujw69dgx";

// Order numbers
const WHATSAPP = "8801957390208";
const IMO = "8801815849575";

// Delivery charge
const DELIVERY_DHAKA = 60;
const DELIVERY_OUT = 120;

// ================= GLOBAL =================
let products = [];
let currentProduct = null;
let currentQty = 1;

// ================= LOAD DATA =================
fetch(SHEET_API)
  .then(res => res.json())
  .then(data => {
    products = data.filter(p => p.active === "TRUE");
    renderHomeSections();   // 🔥 Homepage section render
  })
  .catch(err => {
    console.error("Sheet load error:", err);
  });

// ================= HOMEPAGE SECTIONS =================
function renderHomeSections() {
  const container = document.getElementById("home-sections");
  if (!container) return;

  const categories = [...new Set(products.map(p => p.category))];

  container.innerHTML = categories.map(cat => {
    const items = products.filter(p => p.category === cat).slice(0, 4);

    return `
      <section class="section">
        <div class="section-title">
          <h3>${cat}</h3>
          <button onclick="renderCategory('${cat}')">See More</button>
        </div>

        <div class="products">
          ${items.map(p => `
            <div class="product">
              <img src="${p.image_url}" alt="${p.name}">
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

// ================= CATEGORY PAGE (See More) =================
function renderCategory(category) {
  const container = document.getElementById("home-sections");
  if (!container) return;

  const items = products.filter(p => p.category === category);

  container.innerHTML = `
    <section class="section">
      <div class="section-title">
        <h3>${category}</h3>
        <button onclick="renderHomeSections()">Back</button>
      </div>

      <div class="products">
        ${items.map(p => `
          <div class="product">
            <img src="${p.image_url}" alt="${p.name}">
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
}

// ================= POPUP =================
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

// ================= QUANTITY =================
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

// ================= TOTAL =================
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

// ================= ORDER MESSAGE =================
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

// ================= WHATSAPP =================
function orderWA() {
  const msg = buildMessage();
  window.open(
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
}

// ================= IMO (COPY SYSTEM) =================
function orderIMO() {
  const msg = buildMessage();
  alert(
    "IMO সরাসরি message support করে না।\n\nএই লেখা কপি করুন এবং IMO তে পাঠান:\n\n" +
    msg +
    "\n\nIMO Number: +8801815849575"
  );
}

// ================= SCROLL =================
function scrollToProducts() {
  const el = document.getElementById("home-sections");
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}
