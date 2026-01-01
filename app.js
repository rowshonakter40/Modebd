// === CONFIG ===
const WHATSAPP = "8801957390208";
const IMO = "8801815849575";
const DELIVERY_DHAKA = 60;
const DELIVERY_OUT = 120;

// Placeholder products (Phase-1)
// Phase-2 এ এটা Google Sheet থেকে auto লোড হবে
let products = [
  {name:"Sample Product", price:100, category:"Demo", image:"images/banner.jpg", active:true}
];

let currentProduct = null;

// Render
function render() {
  const cats = [...new Set(products.map(p=>p.category))];
  document.getElementById("categories").innerHTML =
    `<button onclick="filterCat('All')">All</button>` +
    cats.map(c=>`<button onclick="filterCat('${c}')">${c}</button>`).join("");

  filterCat("All");
}

function filterCat(cat){
  const list = products.filter(p=>p.active && (cat==="All" || p.category===cat));
  document.getElementById("products").innerHTML = list.map(p=>`
    <div class="product">
      <img src="${p.image}" style="width:100%">
      <h4>${p.name}</h4>
      <p>${p.price}৳</p>
      <button onclick="openPopup('${p.name}',${p.price})">Order</button>
    </div>
  `).join("");
}

function openPopup(name, price){
  currentProduct = {name, price};
  document.getElementById("popup").style.display="block";
  calcTotal();
}
function closePopup(){ document.getElementById("popup").style.display="none"; }
function calcTotal(){
  const d = +document.getElementById("delivery").value;
  document.getElementById("total").innerText = "Total: " + (currentProduct.price + d) + "৳";
}
document.getElementById("delivery")?.addEventListener("change", calcTotal);

// Orders
function orderWA(){
  const msg = buildMsg();
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`);
}
function orderIMO(){
  window.open(`https://imo.im/?chat=${IMO}`);
}
function buildMsg(){
  return `Shop: Modebd
Product: ${currentProduct.name}
Price: ${currentProduct.price}
Delivery: ${document.getElementById("delivery").value}
Name: ${custName.value}
Phone: ${custPhone.value}
Address: ${custAddress.value}`;
}

function scrollToProducts(){ document.getElementById("products").scrollIntoView({behavior:"smooth"}); }

render();
