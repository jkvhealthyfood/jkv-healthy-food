
let cart = [];

// 4. Shopping Basket / Cart Functions
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
  showToast(`Added "${product.name}" to basket`);
}

function changeQty(productId, delta) {
  const idx = cart.findIndex(item => item.id === productId);
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) {
    cart.splice(idx, 1);
  }
  updateCartUI();
}

function updateCartUI() {
  const badge = document.getElementById('cart-badge');
  const container = document.getElementById('cart-items-container');
  const totalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (totalItems > 0) {
    badge.textContent = totalItems;
    badge.classList.remove('hidden');
    checkoutBtn.disabled = false;
  } else {
    badge.classList.add('hidden');
    checkoutBtn.disabled = true;
  }

  totalEl.textContent = `₹${totalPrice}`;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-16">
        <div class="w-16 h-16 rounded-full bg-brand-mint text-brand-green flex items-center justify-center mx-auto mb-4">
          <i data-lucide="shopping-bag" class="w-8 h-8"></i>
        </div>
        <p class="font-serif text-lg font-bold text-brand-forest">Your basket is empty</p>
        <p class="text-xs text-brand-forest/65 mt-1">Add fresh sprouts, salad boxes, idli batter, or ready-to-cook vegetables to send a combined WhatsApp order.</p>
      </div>
    `;
  } else {
    container.innerHTML = cart.map(item => `
      <div class="flex items-center justify-between gap-3 bg-brand-cream p-4 rounded-2xl border border-brand-sage/50">
        <div class="flex-1">
          <h4 class="font-bold text-sm text-brand-forest">${item.name}</h4>
          <p class="text-xs text-brand-forest/65">${item.weight} • ₹${item.price} each</p>
        </div>
        <div class="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-full border border-brand-sage">
          <button onclick="changeQty('${item.id}', -1)" class="w-6 h-6 rounded-full hover:bg-brand-mint text-brand-forest font-bold flex items-center justify-center cursor-pointer">-</button>
          <span class="text-xs font-bold w-4 text-center">${item.qty}</span>
          <button onclick="changeQty('${item.id}', 1)" class="w-6 h-6 rounded-full hover:bg-brand-mint text-brand-forest font-bold flex items-center justify-center cursor-pointer">+</button>
        </div>
      </div>
    `).join('');
  }

  lucide.createIcons();
}

function toggleCartDrawer(forceOpen = null) {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  const isClosed = drawer.classList.contains('translate-x-full');
  const shouldOpen = forceOpen !== null ? forceOpen : isClosed;

  if (shouldOpen) {
    drawer.classList.remove('translate-x-full');
    backdrop.classList.remove('hidden');
  } else {
    drawer.classList.add('translate-x-full');
    backdrop.classList.add('hidden');
  }
}

function checkoutCartViaWhatsApp() {
  if (cart.length === 0) return;
  const lines = cart.map((item, i) => {
    const productImageUrl = new URL(item.image, window.location.href).href;
    return `${i + 1}. ${item.name} (${item.weight}) x ${item.qty} = ₹${item.price * item.qty}\n   Product Image: ${productImageUrl}`;
  });
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const message = `Hello JKV Healthy Food! I would like to place the following order:\n\n${lines.join('\n\n')}\n\n*Total Amount: ₹${total}*\nPlease confirm availability & delivery time.`;
  window.open(`https://wa.me/919500009535?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
}

// 5. Custom Order Form Submission -> WhatsApp
document.getElementById('whatsapp-order-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('cust-name').value.trim();
  const area = document.getElementById('cust-area').value.trim();
  const product = document.getElementById('cust-product').value;
  const slot = document.getElementById('cust-time').value;
  const notes = document.getElementById('cust-notes').value.trim();

  let msg = `Hello JKV Healthy Food! New Order Inquiry:\n\n• *Name:* ${name}\n• *Area:* ${area}\n• *Selection:* ${product}\n• *Preferred Slot:* ${slot}`;
  if (typeof products !== 'undefined') {
    let matchedProduct;
    if (/idli|batter/i.test(product)) {
      matchedProduct = products.find(item => item.category === 'batters');
    } else if (/sprouts/i.test(product)) {
      matchedProduct = products.find(item => item.category === 'sprouts');
    } else if (/peanut/i.test(product)) {
      matchedProduct = products.find(item => /peanut/i.test(item.name));
    } else if (/corn/i.test(product)) {
      matchedProduct = products.find(item => /corn/i.test(item.name));
    } else if (/chickpea/i.test(product)) {
      matchedProduct = products.find(item => /chickpea/i.test(item.name));
    } else if (/vegetable|fruit/i.test(product)) {
      matchedProduct = products.find(item => /mixed vegetables/i.test(item.name));
    }

    if (matchedProduct && matchedProduct.image) {
      const productImageUrl = new URL(matchedProduct.image, window.location.href).href;
      msg += `\n\n*Product Image:*\n${productImageUrl}`;
    }
  }
  if (notes) msg += `\n• *Notes:* ${notes}`;

  window.open(`https://wa.me/919500009535?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
});

// 6. Toast Helper
let toastTimer;
function showToast(text) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = text;
  toast.classList.remove('opacity-0', 'translate-y-2');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
  }, 2600);
}

// 7. Mobile Navigation Toggle
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
mobileBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
});

// 8. Scroll Behavior
const backToTopButton = document.getElementById('back-to-top');

function updateBackToTopVisibility() {
  backToTopButton.classList.toggle('is-visible', window.scrollY > 400);
}

window.addEventListener('scroll', updateBackToTopVisibility, { passive: true });
backToTopButton.addEventListener('click', () => {
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  window.scrollTo({ top: 0, behavior });
});
updateBackToTopVisibility();

// 9. GSAP Section Animations
function initializeSectionAnimations() {
  if (!window.gsap || !window.ScrollTrigger || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.reveal').forEach((element, index) => {
    gsap.fromTo(element, { autoAlpha: 0, y: 24 }, {
      autoAlpha: 1,
      y: 0,
      duration: 0.7,
      delay: (index % 4) * 0.04,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 88%',
        once: true
      }
    });
  });
}

function initializeReviewCarousel() {
  const track = document.getElementById('review-track');
  const pagination = document.getElementById('review-pagination');
  const previousButton = document.getElementById('review-previous');
  const nextButton = document.getElementById('review-next');
  if (!track || !pagination || !previousButton || !nextButton) return;

  const slides = Array.from(track.querySelectorAll('.review-slide'));
  if (slides.length === 0) return;

  let activeIndex = 0;
  const paginationButtons = slides.map((_, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'w-2.5 h-2.5 rounded-full transition-colors';
    button.setAttribute('aria-label', `Show review ${index + 1}`);
    button.addEventListener('click', () => showSlide(index));
    pagination.appendChild(button);
    return button;
  });

  function updateActiveSlide() {
    activeIndex = Math.min(slides.length - 1, Math.max(0, Math.round(track.scrollLeft / track.clientWidth)));
    paginationButtons.forEach((button, index) => {
      const isActive = index === activeIndex;
      button.classList.toggle('bg-brand-green', isActive);
      button.classList.toggle('bg-brand-sage', !isActive);
      if (isActive) {
        button.setAttribute('aria-current', 'true');
      } else {
        button.removeAttribute('aria-current');
      }
    });
  }

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;
    track.scrollTo({
      left: slides[activeIndex].offsetLeft,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
    updateActiveSlide();
  }

  previousButton.addEventListener('click', () => showSlide(activeIndex - 1));
  nextButton.addEventListener('click', () => showSlide(activeIndex + 1));
  track.addEventListener('scroll', updateActiveSlide, { passive: true });
  track.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') showSlide(activeIndex - 1);
    if (event.key === 'ArrowRight') showSlide(activeIndex + 1);
  });
  window.addEventListener('resize', updateActiveSlide);
  updateActiveSlide();
}

function initializePageLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  const logo = loader.querySelector('.page-loader__logo');
  if (window.gsap && logo && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.to(logo, { scale: 1.035, duration: 0.9, ease: 'sine.inOut', repeat: -1, yoyo: true });
  }

  const hideLoader = () => {
    if (window.gsap) {
      gsap.to(loader, { autoAlpha: 0, duration: 0.45, ease: 'power2.out', onComplete: () => loader.remove() });
    } else {
      loader.classList.add('is-hidden');
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }
  };

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader, { once: true });
  }
}

// Initialize Page
renderProducts('all');
updateCartUI();
lucide.createIcons();
initializeSectionAnimations();
initializeReviewCarousel();
initializePageLoader();
