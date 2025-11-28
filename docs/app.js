// Shared app logic: cart, badges, modal, simple player point increment across pages
const STORAGE_KEY = 'neonravens_cart_v1';

function loadCart(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){ return []; }
}
function saveCart(cart){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

let cart = loadCart();

function updateBadge(){
  const total = cart.reduce((s,i)=>s+i.qty,0);
  document.querySelectorAll('.badge').forEach(b=>{ b.textContent = total; b.style.display = total? 'inline-block':'none'; });
}
function openModal(modalId){
  const modal = document.getElementById(modalId) || document.querySelector('.modal');
  if(modal){
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    renderCart(modal);
  }
}
function closeAllModals(){
  document.querySelectorAll('.modal').forEach(m=>{ m.classList.remove('open'); m.setAttribute('aria-hidden','true'); });
}

function renderCart(modal){
  const content = modal.querySelector('.cart-content');
  content.innerHTML = '';
  if(cart.length===0){ content.innerHTML = '<div class="muted">Your cart is empty.</div>'; modal.querySelector('.total span').textContent='0.00'; return; }
  let total = 0;
  cart.forEach(item=>{
    const row = document.createElement('div');
    row.style.display='flex'; row.style.justifyContent='space-between'; row.style.marginBottom='8px';
    row.innerHTML = `<div>${item.title} <small style="color:rgba(255,255,255,0.6)">x${item.qty}</small></div><div>€${(item.price*item.qty).toFixed(2)}</div>`;
    content.appendChild(row);
    total += item.price*item.qty;
  });
  modal.querySelector('.total span').textContent = total.toFixed(2);
}

function addToCart(id,title,price){
  const existing = cart.find(c=>c.id===id);
  if(existing) existing.qty += 1;
  else cart.push({id,title,price,qty:1});
  saveCart(cart);
  updateBadge();
  // open the first modal found
  openModal();
}

function clearCart(){
  cart = []; saveCart(cart); updateBadge(); closeAllModals();
}

function checkoutDemo(){
  alert('Demo checkout - integrate real payment gateway for production.');
  clearCart();
}

// wire up cart buttons and badges on page load
document.addEventListener('DOMContentLoaded', ()=>{
  updateBadge();

  // attach global cart buttons
  document.querySelectorAll('.cart-btn').forEach(btn=>{
    btn.addEventListener('click', ()=> openModal());
  });

  document.querySelectorAll('[id^="closeCart"]').forEach(b=>{
    b.addEventListener('click', ()=> closeAllModals());
  });

  document.querySelectorAll('[id^="clearCart"]').forEach(b=>{
    b.addEventListener('click', ()=> { clearCart(); renderCart(document.querySelector('.modal.open')||document.querySelector('.modal')); });
  });

  document.querySelectorAll('[id^="checkout"]').forEach(b=>{
    b.addEventListener('click', ()=> { checkoutDemo(); });
  });

  // attach add-to-cart buttons
  document.querySelectorAll('.add-to-cart').forEach(b=>{
    b.addEventListener('click', (e)=>{
      const id = b.getAttribute('data-id');
      const title = b.getAttribute('data-title');
      const price = parseFloat(b.getAttribute('data-price'));
      addToCart(id,title,price);
    });
  });

  // simple player point demo (works on team page)
  document.querySelectorAll('.add-point').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.getAttribute('data-id');
      // store points per player in localStorage
      const key = 'neonravens_players_v1';
      let players = {};
      try{ players = JSON.parse(localStorage.getItem(key) || '{}'); }catch(e){ players = {}; }
      players[id] = (players[id] || 0) + 1;
      localStorage.setItem(key, JSON.stringify(players));
      btn.blur();
      alert('Point added to player #' + id + ' (demo).');
    });
  });

});


function openJoinModal(planName) {
  const modal = document.getElementById('joinModal');
  const modalTitle = document.getElementById('modalTitle');

  if (modal) {
    modal.style.display = 'flex'; 
    
    if (modalTitle) {
      modalTitle.innerText = 'Join ' + planName; 
    }
    if (planName === 'Free') {
      if(paymentSection) paymentSection.style.display = 'none';
    } else {
      if(paymentSection) paymentSection.style.display = 'block';
    }
  } else {
    console.error();
  }
}

window.addEventListener('click', function(event) {
  const joinModal = document.getElementById('joinModal');
});

function closeJoinModal() {
  const modal = document.getElementById('joinModal');
  if (modal) {
    modal.style.display = 'none';
  }
}