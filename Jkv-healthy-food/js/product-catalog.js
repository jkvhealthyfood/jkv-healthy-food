const products = [
  ...window.freshSproutProducts,
  ...window.saladBoxProducts,
  ...window.sproutsIdliBatterProducts,
  ...window.readyToCookVegetableProducts
];

const productsPerPage = 4;
let activeProductFilter = 'all';
let visibleProductCount = productsPerPage;

// 2. Render Product Cards
function renderProducts(filter = activeProductFilter) {
  const grid = document.getElementById('product-grid');
  if (filter !== activeProductFilter) {
    activeProductFilter = filter;
    visibleProductCount = productsPerPage;
  }
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

  grid.innerHTML = filtered.slice(0, visibleProductCount).map(product => {
    const waText = encodeURIComponent(`Hello JKV Healthy Food! I would like to order:\n• ${product.name} (${product.weight}) - ₹${product.price}`);
    return `
      <article class="bg-brand-cream/70 hover:bg-white rounded-3xl border border-brand-sage/60 overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between group">
        <div>
          <!-- Image Container -->
          <div class="relative aspect-[4/3] overflow-hidden bg-brand-mint">
            <img 
              src="${product.image}" 
              onerror="this.src='https://placehold.co/600x450/E8F5E9/2E7D32?text=${encodeURIComponent(product.name)}'"
              alt="${product.name}" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span class="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-brand-dark text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs">
              ${product.badge}
            </span>
            <span class="absolute bottom-3 right-3 bg-brand-forest/85 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
              ${product.weight}
            </span>
          </div>

          <!-- Card Details -->
          <div class="p-5">
            <div class="flex items-center justify-between gap-2 mb-1.5">
              <span class="text-[11px] font-semibold text-brand-green uppercase tracking-wider">${product.shelfLife}</span>
            </div>
            <h3 class="font-serif text-lg font-bold text-brand-forest leading-snug mb-2">${product.name}</h3>
            <p class="text-xs text-brand-forest/75 leading-relaxed line-clamp-3">${product.description}</p>
          </div>
        </div>

        <!-- Price & Order Actions -->
        <div class="px-5 pb-5 pt-2">
          <div class="flex items-center justify-between pt-3 border-t border-brand-sage/50 mb-3">
            <div>
              <span class="text-[11px] text-brand-forest/60 block">Price</span>
              <span class="font-serif text-2xl font-bold text-brand-green">₹${product.price}</span>
            </div>
            <button onclick="addToCart('${product.id}')" class="inline-flex items-center gap-1.5 bg-brand-mint hover:bg-brand-sage text-brand-dark text-xs font-bold px-3.5 py-2.5 rounded-full transition-colors cursor-pointer">
              <i data-lucide="plus" class="w-4 h-4"></i>
              <span>Add to Basket</span>
            </button>
          </div>

          <a href="https://wa.me/919500009535?text=${waText}" target="_blank" rel="noopener noreferrer" class="w-full inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-dark text-white text-xs font-semibold py-3 px-4 rounded-full shadow-2xs transition-colors">
            <img src="images/whatsapp.png" alt="" class="w-4 h-4 object-contain" />
            <span>Order via WhatsApp</span>
          </a>
        </div>
      </article>
    `;
  }).join('');

  document.getElementById('load-more-products').classList.toggle('hidden', visibleProductCount >= filtered.length);
  lucide.createIcons();
}

document.getElementById('load-more-products').addEventListener('click', () => {
  visibleProductCount += productsPerPage;
  renderProducts();
});

// 3. Category Filter Handling
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.remove('active', 'bg-brand-green', 'text-white', 'shadow-sm');
      b.classList.add('bg-brand-cream', 'text-brand-forest', 'border', 'border-brand-sage/60');
    });
    btn.classList.add('active', 'bg-brand-green', 'text-white', 'shadow-sm');
    btn.classList.remove('bg-brand-cream', 'text-brand-forest', 'border', 'border-brand-sage/60');
    renderProducts(btn.dataset.filter);
  });
});
