const API = `${location.protocol}//${location.hostname || 'localhost'}:3000/api`;
const menu = [
  ['beef_olympus','Olympus 經典牛肉堡',240], ['chicken_storm','風暴香酥雞腿堡',165], ['pork_bbq','火星煙燻 BBQ 豬肉堡',185], ['beef_truffle','Truffle 松露牛肉堡',210], ['chicken_honey','蜂蜜芥末雞肉堡',175], ['veggie_falafel','香料鷹嘴豆蔬食堡',170], ['chicken_pork','韓式烤肉雞腿堡',180], ['beef_curiosity','Curiosity 牛肉起司堡',160], ['beef_peanut','花生培根牛肉堡',195], ['veggie_oasis','Oasis 綠洲蔬食堡',155], ['combo_a','A 號火星套餐',110], ['combo_b','B 號太空套餐',95], ['side_fries','經典脆薯',55], ['side_tater_tots','星球薯球',75], ['side_fried_chicken','火星炸雞',65], ['side_tenders','香脆雞柳條',80], ['drink_soda','氣泡飲',40], ['drink_sprite','檸檬汽水',40], ['drink_tea','冰茶',40], ['drink_coffee','宇宙咖啡',79], ['drink_sunset','日落特調',99], ['combo_c','C 號豪華套餐',149]
].map(([name,label,price]) => ({ name, label, price }));
let cart = [];
const $ = selector => document.querySelector(selector);
const money = value => new Intl.NumberFormat('zh-TW', { style:'currency', currency:'TWD', maximumFractionDigits:0 }).format(value);
const token = () => localStorage.getItem('mars_token');
const user = () => JSON.parse(localStorage.getItem('mars_user') || 'null');
const modal = id => bootstrap.Modal.getOrCreateInstance($(id));

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, { ...options, headers: { 'Content-Type':'application/json', ...(token() ? { Authorization:`Bearer ${token()}` } : {}), ...(options.headers || {}) } });
  const content = response.headers.get('content-type') || '';
  const data = content.includes('application/json') ? await response.json() : await response.text();
  if (!response.ok) throw new Error(data.message || '操作失敗，請稍後再試。');
  return data;
}

function renderMenu() { $('#menu').innerHTML = menu.map((item, index) => `<div class="col-md-4 mb-3"><div class="card food-card h-100 overflow-hidden"><img src="images/${item.name}.jpg" alt="${item.label}" class="card-img-top" style="height:160px;object-fit:cover"><div class="card-body d-flex flex-column"><h5>${item.label}</h5><p class="price mt-auto">${money(item.price)}</p><button type="button" class="btn btn-outline-danger" onclick="addCart(${index})">加入購物車</button></div></div></div>`).join(''); }
function renderCart() { const count = cart.reduce((sum, item) => sum + item.quantity, 0); $('#cartCount').textContent = count; $('#cart').innerHTML = cart.length ? `${cart.map((item,index) => `<div>${item.label} × ${item.quantity}　${money(item.price * item.quantity)} <button type="button" class="btn btn-sm btn-link text-danger" onclick="removeCart(${index})">移除</button></div>`).join('')}<hr><strong>總計：${money(cart.reduce((sum,item) => sum + item.price * item.quantity, 0))}</strong>` : '尚未加入商品'; }
window.addCart = index => { const item = cart.find(value => value.name === menu[index].name); item ? item.quantity++ : cart.push({ ...menu[index], quantity:1 }); renderCart(); };
window.removeCart = index => { cart.splice(index, 1); renderCart(); };

function renderAccount() { const current = user(); $('#accountArea').innerHTML = current ? `<span class="text-white me-2">${current.username}</span><button type="button" class="btn btn-sm btn-outline-light" onclick="logout()">登出</button>` : ''; $('#authPanel').style.display = current ? 'none' : ''; }
window.logout = () => { localStorage.removeItem('mars_token'); localStorage.removeItem('mars_user'); location.reload(); };
const statusName = status => ({pending:'待處理',processing:'製作中',completed:'已完成',cancelled:'已取消'}[status] || status);
async function loadMine() { if (!token()) return; try { const { orders } = await request('/orders/mine'); $('#myOrders').innerHTML = orders.length ? `<div class="table-responsive"><table class="table"><thead><tr><th>訂單編號</th><th>內容</th><th>金額</th><th>狀態</th><th>時間</th></tr></thead><tbody>${orders.map(order => `<tr><td>${order.orderNumber}</td><td>${order.meals.map(meal => `${meal.name} × ${meal.quantity}`).join('<br>')}</td><td>${money(order.totalPrice)}</td><td>${statusName(order.status)}</td><td>${new Date(order.createdAt).toLocaleString('zh-TW')}</td></tr>`).join('')}</tbody></table></div>` : '尚無訂單。'; } catch (error) { $('#myOrders').textContent = error.message; } }

async function login(form) { const result = await request('/login', { method:'POST', body:JSON.stringify(Object.fromEntries(new FormData(form))) }); localStorage.setItem('mars_token', result.token); localStorage.setItem('mars_user', JSON.stringify(result.user)); renderAccount(); await loadMine(); return result; }
async function register(form) { const values = Object.fromEntries(new FormData(form)); const result = await request('/register', { method:'POST', body:JSON.stringify({ username:values.username, email:values.email, password:values.password }) }); localStorage.setItem('mars_token', result.token); localStorage.setItem('mars_user', JSON.stringify(result.user)); renderAccount(); await loadMine(); return result; }
window.openMemberLogin = () => modal('#memberLoginModal').show();

document.addEventListener('DOMContentLoaded', () => {
  renderMenu(); renderCart(); renderAccount(); loadMine();
  $('#loginForm').addEventListener('submit', async event => { event.preventDefault(); try { await login(event.target); } catch (error) { alert(error.message); } });
  $('#modalLoginForm').addEventListener('submit', async event => { event.preventDefault(); try { await login(event.target); modal('#memberLoginModal').hide(); event.target.reset(); } catch (error) { alert(error.message); } });
  document.querySelectorAll('.hero .btn-mars, .hero .btn-cyber').forEach(button => button.addEventListener('click', event => {
    event.preventDefault();
    if (!token()) return openMemberLogin();
    document.querySelector(button.classList.contains('btn-mars') ? '#catalog' : '#mine').scrollIntoView({ behavior:'smooth' });
  }));
  $('#goRegister').onclick = () => { modal('#memberLoginModal').hide(); modal('#registerModal').show(); };
  $('#goLogin').onclick = () => { modal('#registerModal').hide(); openMemberLogin(); };
  $('#forgotPassword').onclick = () => { location.href = `mailto:xocialphobia@gmail.com?subject=${encodeURIComponent('MARS Burger｜忘記密碼重設申請')}`; };
  $('#modalRegisterForm').addEventListener('submit', async event => { event.preventDefault(); const values = Object.fromEntries(new FormData(event.target)); if (values.password !== values.passwordConfirm) return alert('兩次輸入的密碼不一致。'); try { await register(event.target); modal('#registerModal').hide(); event.target.reset(); alert('註冊成功，已登入。'); } catch (error) { alert(error.message); } });
  const terms = modal('#termsModal'); let pendingRegister = false;
  $('#termsCheck').addEventListener('change', event => { if (event.target.checked) terms.show(); });
  $('#termsLink').onclick = event => { event.preventDefault(); terms.show(); };
  $('#registerForm').addEventListener('submit', event => { event.preventDefault(); if (!$('#termsCheck').checked) return alert('請先閱讀並勾選會員通訊協議條款。'); pendingRegister = true; terms.show(); });
  $('#btnConfirmRegister').onclick = async () => {
    if (!pendingRegister) { terms.hide(); return; }
    const button = $('#btnConfirmRegister');
    button.disabled = true;
    try { await register($('#registerForm')); terms.hide(); $('#registerForm').reset(); $('#termsCheck').checked = false; alert('註冊成功，已登入。'); }
    catch (error) { alert(error.message); }
    finally { pendingRegister = false; button.disabled = false; }
  };
  const pickupType = $('#orderForm select[name="pickupType"]');
  const updateDeliveryAddress = () => {
    const existing = $('#deliveryAddressField');
    if (pickupType.value === '外送' && !existing) pickupType.closest('.col-md-2').insertAdjacentHTML('afterend', '<div class="col-12" id="deliveryAddressField"><input name="deliveryAddress" class="form-control" placeholder="外送地址" required></div>');
    if (pickupType.value !== '外送' && existing) existing.remove();
  };
  pickupType.addEventListener('change', updateDeliveryAddress);
  $('#orderForm').addEventListener('submit', async event => { event.preventDefault(); if (!token()) return openMemberLogin(); if (!cart.length) return alert('請先加入餐點。'); try { const meals = cart.map(item => ({ name:item.label, price:item.price, quantity:item.quantity })); const data = { ...Object.fromEntries(new FormData(event.target)), meals, totalPrice:cart.reduce((sum,item) => sum + item.price * item.quantity,0) }; const result = await request('/orders', { method:'POST', body:JSON.stringify(data) }); cart=[]; renderCart(); event.target.reset(); updateDeliveryAddress(); alert(`訂單成立：${result.orderNumber}`); loadMine(); } catch (error) { alert(error.message); } });
});
