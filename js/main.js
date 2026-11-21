/* JIKOKOA LIMITED – shared behaviour: loader, cart, checkout, effects */
(function () {
  "use strict";
  var WAI = '<svg class="wai" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';
  var P = window.JK_PRODUCTS, CFG = window.JK_CONFIG, KEY = "jikokoa_cart_v1";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var kes = function (n) { return "KSh " + Number(n).toLocaleString("en-KE"); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Page loader (logo) ---------- */
  var loader = document.createElement("div");
  loader.className = "loader show";
  loader.setAttribute("aria-hidden", "true");
  loader.innerHTML = '<div class="loader-inner"><img src="assets/img/logo-sm.jpg" alt=""><div class="loader-bar"><span></span></div></div>';
  document.body.appendChild(loader);
  function hideLoader() { loader.classList.remove("show"); }
  function showLoader() { loader.classList.add("show"); }
  var minShow = Date.now();
  window.addEventListener("load", function () { setTimeout(hideLoader, Math.max(0, 700 - (Date.now() - minShow))); });
  setTimeout(hideLoader, 3500); // safety
  window.addEventListener("pageshow", function (e) { if (e.persisted) hideLoader(); });

  /* ---------- Logo mini-loader on every clickable button ---------- */
  function btnLoading(el, ms) {
    if (el.classList.contains("is-loading")) return;
    el.classList.add("is-loading");
    var g = document.createElement("img");
    g.src = "assets/img/favicon.png"; g.alt = ""; g.className = "btn-gear";
    el.appendChild(g);
    setTimeout(function () { el.classList.remove("is-loading"); if (g.parentNode) g.parentNode.removeChild(g); }, ms || 650);
  }
  document.addEventListener("click", function (e) {
    var el = e.target.closest("button, .btn, .chip, .tab, .nav a, .cart-btn, a.js-load");
    if (!el || el.disabled || el.classList.contains("no-load") || el.closest(".no-load")) return;
    // ripple
    if (!reduce && (el.matches(".btn") || el.matches("button.btn"))) {
      var r = el.getBoundingClientRect(), s = document.createElement("span");
      s.className = "ripple"; s.style.left = (e.clientX - r.left) + "px"; s.style.top = (e.clientY - r.top) + "px";
      el.appendChild(s); setTimeout(function () { s.remove(); }, 600);
    }
    if (el.matches(".btn, .cart-btn, button.primary")) btnLoading(el);
  }, true);

  // internal navigation shows the logo loader
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
    var h = a.getAttribute("href");
    if (!h || h.charAt(0) === "#" || /^(tel:|mailto:|https?:|javascript:)/i.test(h)) return;
    if (a.hostname && a.hostname !== location.hostname) return;
    showLoader();
  });

  /* ---------- Cart store ---------- */
  var cart = [];
  function load() { try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { cart = []; } if (!Array.isArray(cart)) cart = []; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} }
  function findProduct(id) { return P.filter(function (p) { return p.id === id; })[0]; }
  function lineInfo(it) {
    var p = findProduct(it.id); if (!p) return null;
    var s = p.sizes.filter(function (x) { return x.label === it.size; })[0]; if (!s) return null;
    return { p: p, s: s, img: s.img || p.img, total: s.price * it.qty };
  }
  function clean() { cart = cart.filter(function (i) { return lineInfo(i) && i.qty > 0; }); }
  function count() { return cart.reduce(function (n, i) { return n + i.qty; }, 0); }
  function total() { return cart.reduce(function (n, i) { var l = lineInfo(i); return n + (l ? l.total : 0); }, 0); }

  var Cart = {
    add: function (id, size, qty) {
      qty = qty || 1;
      var it = cart.filter(function (i) { return i.id === id && i.size === size; })[0];
      if (it) it.qty = Math.min(99, it.qty + qty); else cart.push({ id: id, size: size, qty: qty });
      save(); render(); bump();
    },
    setQty: function (id, size, q) {
      cart.forEach(function (i) { if (i.id === id && i.size === size) i.qty = Math.max(1, Math.min(99, q)); });
      save(); render();
    },
    remove: function (id, size) { cart = cart.filter(function (i) { return !(i.id === id && i.size === size); }); save(); render(); },
    clear: function () { cart = []; save(); render(); }
  };
  window.JKCart = Cart;

  /* ---------- Cart drawer UI ---------- */
  var drawer = document.createElement("aside");
  drawer.className = "drawer"; drawer.id = "cartDrawer";
  drawer.setAttribute("aria-label", "Shopping cart"); drawer.setAttribute("aria-hidden", "true");
  drawer.innerHTML =
    '<div class="drawer-head"><h3>Your Cart <span id="dCount"></span></h3><button class="icon-btn no-load" id="dClose" aria-label="Close cart">&times;</button></div>' +
    '<div class="drawer-body" id="dBody"></div>' +
    '<div class="drawer-foot" id="dFoot">' +
    '<div class="row"><span>Subtotal</span><strong id="dTotal"></strong></div>' +
    '<p class="note">🚚 After payment, delivery takes <b>12 to 24 hours</b>. Delivery cost is confirmed on WhatsApp.</p>' +
    '<button class="btn btn-primary block" id="dOrder">'+WAI+' Order Now on WhatsApp</button>' +
    '<button class="btn btn-ghost block" id="dClear">Clear all</button></div>';
  var scrim = document.createElement("div"); scrim.className = "scrim"; scrim.id = "scrim";
  document.body.appendChild(scrim); document.body.appendChild(drawer);

  function openDrawer() { drawer.classList.add("open"); scrim.classList.add("show"); drawer.setAttribute("aria-hidden", "false"); document.body.classList.add("lock"); }
  function closeDrawer() { drawer.classList.remove("open"); scrim.classList.remove("show"); drawer.setAttribute("aria-hidden", "true"); if (!modalOpen()) document.body.classList.remove("lock"); }
  window.JKCart.open = openDrawer;

  function render() {
    clean();
    var n = count();
    $$("[data-cart-count]").forEach(function (b) { b.textContent = n; b.classList.toggle("zero", n === 0); });
    $("#dCount").textContent = n ? "(" + n + ")" : "";
    var body = $("#dBody");
    if (!cart.length) {
      body.innerHTML = '<div class="empty"><img src="assets/img/icon.jpg" alt=""><p>Your cart is empty.</p><a class="btn btn-primary" href="shop">Browse the shop</a></div>';
      $("#dFoot").style.display = "none"; return;
    }
    $("#dFoot").style.display = "";
    body.innerHTML = cart.map(function (it) {
      var l = lineInfo(it);
      return '<div class="ci"><img src="' + l.img + '" alt="' + esc(l.p.name) + '"><div class="ci-info"><h4>' + esc(l.p.name) + '</h4><small>' + esc(l.p.sizeLabel) + ': ' + esc(it.size) + ' &middot; ' + kes(l.s.price) + '</small>' +
        '<div class="qty" data-id="' + it.id + '" data-size="' + esc(it.size) + '"><button class="no-load" data-q="-1" aria-label="Decrease">&minus;</button><span>' + it.qty + '</span><button class="no-load" data-q="1" aria-label="Increase">+</button></div></div>' +
        '<div class="ci-side"><strong>' + kes(l.total) + '</strong><button class="rm no-load" data-rm="' + it.id + '" data-size="' + esc(it.size) + '">Remove</button></div></div>';
    }).join("");
    $("#dTotal").textContent = kes(total());
  }

  drawer.addEventListener("click", function (e) {
    var q = e.target.closest("[data-q]"), rm = e.target.closest("[data-rm]");
    if (q) { var w = q.parentNode; var it = cart.filter(function (i) { return i.id === w.dataset.id && i.size === w.dataset.size; })[0]; if (it) Cart.setQty(it.id, it.size, it.qty + Number(q.dataset.q)); }
    if (rm) Cart.remove(rm.dataset.rm, rm.dataset.size);
  });
  $("#dClose").onclick = closeDrawer; scrim.onclick = function () { closeDrawer(); };
  var cd = document.createElement("div"); cd.className = "cdlg no-load";
  cd.innerHTML = '<div role="alertdialog"><h4>Clear cart?</h4><p>This will remove all items from your cart.</p><div class="two"><button class="btn btn-ghost" id="cdNo">Keep items</button><button class="btn btn-danger" id="cdYes">Clear all</button></div></div>';
  document.body.appendChild(cd);
  $("#cdNo").onclick = function () { cd.classList.remove("show"); };
  $("#cdYes").onclick = function () { cd.classList.remove("show"); Cart.clear(); toast("Cart cleared"); };
  cd.addEventListener("mousedown", function (e) { if (e.target === cd) cd.classList.remove("show"); });
  $("#dClear").onclick = function () { cd.classList.add("show"); };
  $("#dOrder").onclick = function () { closeDrawer(); setTimeout(openCheckout, 200); };
  $$("[data-open-cart]").forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); openDrawer(); }); });
  window.addEventListener("storage", function (e) { if (e.key === KEY) { load(); render(); } });

  function bump() {
    $$(".cart-btn").forEach(function (b) { b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); });
    toast("Added to cart ✔");
  }
  var toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add("show");
    clearTimeout(toastEl._t); toastEl._t = setTimeout(function () { toastEl.classList.remove("show"); }, 1800);
  }
  window.JKToast = toast;

  /* ---------- Checkout modal ---------- */
  var modal = document.createElement("div");
  modal.className = "modal"; modal.id = "checkout"; modal.setAttribute("role", "dialog"); modal.setAttribute("aria-modal", "true"); modal.setAttribute("aria-hidden", "true");
  var countyOpts = window.JK_COUNTIES.map(function (c) { return '<option value="' + c + '">' + c + '</option>'; }).join("");
  modal.innerHTML =
    '<div class="modal-card"><button class="icon-btn no-load modal-x" id="mClose" aria-label="Close">&times;</button>' +
    '<h3>Checkout on WhatsApp</h3><p class="sub">Fill in your details and we will receive your order on WhatsApp instantly.</p>' +
    '<form id="coForm" novalidate>' +
    '<label>✅ Full Names<input name="name" autocomplete="name" placeholder="e.g. Jane Wanjiru Kamau" required></label>' +
    '<label>✅ Active Number<input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="e.g. 0712 345 678" required></label>' +
    '<label>✅ Size <span class="hint">(from your cart)</span><div class="sizebox" id="coSizes"></div></label>' +
    '<label>✅ Location of Delivery: County<select name="county" required><option value="">Select county…</option>' + countyOpts + '</select></label>' +
    '<label>Specific town / area / estate<input name="town" placeholder="e.g. Ruiru, Kamakis, near Total petrol station" required></label>' +
    '<fieldset><legend>✅ The Receiver</legend>' +
    '<label class="radio"><input type="radio" name="rcv" value="me" checked> I will receive it myself</label>' +
    '<label class="radio"><input type="radio" name="rcv" value="other"> Someone else will receive it</label>' +
    '<div id="rcvOther" hidden><label>Receiver\'s full names<input name="rname" placeholder="Receiver name"></label><label>Receiver\'s phone number<input name="rphone" type="tel" inputmode="tel" placeholder="Receiver phone"></label></div></fieldset>' +
    '<div class="co-total"><span>Order total</span><strong id="coTotal"></strong></div>' +
    '<p class="note">🚚 After payment, delivery takes <b>12 to 24 hours</b>.</p>' +
    '<p class="err" id="coErr" role="alert"></p>' +
    '<button type="submit" class="btn btn-wa block">'+WAI+' Send Order to WhatsApp</button></form></div>';
  document.body.appendChild(modal);

  function modalOpen() { return modal.classList.contains("show"); }
  function openCheckout() {
    clean(); if (!cart.length) { toast("Your cart is empty"); return; }
    $("#coSizes").innerHTML = cart.map(function (it) { var l = lineInfo(it); return '<div><span>' + it.qty + '&times; ' + esc(l.p.name) + '</span><b>' + esc(it.size) + '</b></div>'; }).join("");
    $("#coTotal").textContent = kes(total());
    $("#coErr").textContent = "";
    modal.classList.add("show"); modal.setAttribute("aria-hidden", "false"); document.body.classList.add("lock");
    try { var sv = JSON.parse(localStorage.getItem("jikokoa_cust") || "{}"); var f = $("#coForm"); ["name", "phone", "county", "town"].forEach(function (k) { if (sv[k] && !f[k].value) f[k].value = sv[k]; }); } catch (e) {}
  }
  function closeCheckout() { modal.classList.remove("show"); modal.setAttribute("aria-hidden", "true"); document.body.classList.remove("lock"); }
  $("#mClose").onclick = closeCheckout;
  modal.addEventListener("mousedown", function (e) { if (e.target === modal) closeCheckout(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeCheckout(); closeDrawer(); } });
  $$("#coForm input[name=rcv]").forEach(function (r) { r.onchange = function () { $("#rcvOther").hidden = $("#coForm").rcv.value !== "other"; }; });

  function normPhone(v) {
    var d = String(v).replace(/[^\d+]/g, "");
    if (/^\+?254[17]\d{8}$/.test(d)) return "+" + d.replace("+", "");
    if (/^0[17]\d{8}$/.test(d)) return "+254" + d.slice(1);
    if (/^[17]\d{8}$/.test(d)) return "+254" + d;
    return null;
  }
  $("#coForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target, err = $("#coErr"), name = f.name.value.trim(), ph = normPhone(f.phone.value), town = f.town.value.trim(), county = f.county.value;
    var other = f.rcv.value === "other", rn = f.rname.value.trim(), rp = normPhone(f.rphone.value);
    if (name.length < 3) return (err.textContent = "Please enter your full names.");
    if (!ph) return (err.textContent = "Please enter a valid Kenyan phone number, e.g. 0712 345 678.");
    if (!county) return (err.textContent = "Please select the delivery county.");
    if (town.length < 2) return (err.textContent = "Please type the specific town or area of delivery.");
    if (other && (rn.length < 3 || !rp)) return (err.textContent = "Please enter the receiver's names and a valid phone number.");
    err.textContent = "";
    try { localStorage.setItem("jikokoa_cust", JSON.stringify({ name: name, phone: f.phone.value, county: county, town: town })); } catch (x) {}

    var lines = cart.map(function (it) { var l = lineInfo(it); return "• " + it.qty + " x " + l.p.name + " (" + it.size + ") = " + kes(l.total); }).join("\n");
    var sizes = cart.map(function (it) { return lineInfo(it).p.name + " - " + it.size + " (x" + it.qty + ")"; }).join(", ");
    var msg = "*NEW ORDER - JIKOKOA LIMITED*\n\n" +
      "✅ *Full Names:* " + name + "\n" +
      "✅ *Active Number:* " + ph + "\n" +
      "✅ *Size:* " + sizes + "\n" +
      "✅ *Location of Delivery:* " + town + ", " + county + " County\n" +
      "✅ *The Receiver:* " + (other ? rn + " (" + rp + ")" : name + " (myself)") + "\n\n" +
      "*Items*\n" + lines + "\n\n*Total: " + kes(total()) + "*\n\n" +
      "Delivery takes 12 to 24 hrs after payment. Please confirm delivery cost and payment details. Thank you.";
    showLoader();
    var url = "https://wa.me/" + CFG.whatsapp + "?text=" + encodeURIComponent(msg);
    setTimeout(function () { window.location.href = url; setTimeout(function () { hideLoader(); closeCheckout(); }, 2500); }, 700);
  });

  /* ---------- Header / nav ---------- */
  var header = $(".site-header");
  function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 30); var pb = $(".progress"); if (pb) { var h = document.documentElement; pb.style.width = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight) * 100) + "%"; } }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  var burger = $("#burger");
  if (burger) burger.onclick = function () { var o = document.body.classList.toggle("nav-open"); burger.setAttribute("aria-expanded", o); };
  function closeNav() { document.body.classList.remove("nav-open"); if (burger) burger.setAttribute("aria-expanded", "false"); }
  var nx = $("#navClose"), ns = $("#navScrim"); if (nx) nx.onclick = closeNav; if (ns) ns.onclick = closeNav;
  $$(".nav a").forEach(function (a) { a.addEventListener("click", function () { document.body.classList.remove("nav-open"); }); });

  /* ---------- Scroll reveal & counters ---------- */
  function setupReveal() {
    var els = $$(".reveal:not(.in)");
    if (!("IntersectionObserver" in window) || reduce) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }); }, { threshold: 0.12 });
    els.forEach(function (e, i) { e.style.transitionDelay = (i % 4) * 80 + "ms"; io.observe(e); });
  }
  window.JKReveal = setupReveal; setupReveal();

  $$("[data-count]").forEach(function (el) {
    var end = +el.dataset.count, suf = el.dataset.suffix || "", done = false;
    function run() { if (done) return; done = true; if (reduce) { el.textContent = end + suf; return; } var t0 = performance.now(); (function f(t) { var p = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(f); })(t0); }
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en, o) { if (en[0].isIntersecting) { run(); o.disconnect(); } }).observe(el); else run();
  });

  /* ---------- Ember particles (canvas) ---------- */
  $$("canvas.embers").forEach(function (cv) {
    if (reduce) return;
    var ctx = cv.getContext("2d"), W, H, parts = [], N = window.innerWidth < 700 ? 28 : 55;
    function size() { var r = cv.parentNode.getBoundingClientRect(); W = cv.width = r.width; H = cv.height = r.height; }
    function mk(init) { return { x: Math.random() * W, y: init ? Math.random() * H : H + 10, r: Math.random() * 2.2 + 0.6, v: Math.random() * 0.8 + 0.3, dx: (Math.random() - 0.5) * 0.5, a: Math.random() * 0.6 + 0.3, ph: Math.random() * 6 }; }
    size(); for (var i = 0; i < N; i++) parts.push(mk(true));
    window.addEventListener("resize", size);
    var vis = true; if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { vis = e[0].isIntersecting; }).observe(cv);
    (function loop(t) {
      if (vis) {
        ctx.clearRect(0, 0, W, H);
        parts.forEach(function (p, i) {
          p.y -= p.v; p.x += p.dx + Math.sin(t / 900 + p.ph) * 0.35; p.a -= 0.0015;
          if (p.y < -10 || p.a <= 0) parts[i] = mk(false);
          var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
          g.addColorStop(0, "rgba(255,190,70," + p.a + ")"); g.addColorStop(1, "rgba(255,90,0,0)");
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, 6.3); ctx.fill();
        });
      }
      requestAnimationFrame(loop);
    })(0);
  });

  /* ---------- Hero parallax / tilt ---------- */
  var heroLogo = $(".hero-logo");
  if (heroLogo && !reduce) window.addEventListener("scroll", function () { var y = Math.min(window.scrollY, 600); heroLogo.style.opacity = Math.max(0.15, 1 - y / 800); }, { passive: true });
  var hv = $(".hero-video");
  if (hv) { var pp = hv.play && hv.play(); if (pp && pp.catch) pp.catch(function () {}); }

  window.JKTilt = function (root) {
    if (reduce || !window.matchMedia("(hover: hover)").matches) return;
    $$(".tilt", root).forEach(function (c) {
      c.addEventListener("mousemove", function (e) { var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; c.style.transform = "perspective(800px) rotateY(" + x * 7 + "deg) rotateX(" + -y * 7 + "deg) translateY(-4px)"; });
      c.addEventListener("mouseleave", function () { c.style.transform = ""; });
    });
  };
  window.JKTilt(document);

  /* ---------- Product cards (shop + home) ---------- */
  window.JKRenderProducts = function (host, list) {
    host.innerHTML = list.map(function (p) {
      var chips = p.sizes.map(function (s, i) { return '<button type="button" class="chip no-load' + (i === 0 ? " on" : "") + '" data-i="' + i + '">' + esc(s.label) + '</button>'; }).join("");
      var thumbs = p.img2 ? '<div class="thumbs"><button class="no-load on" data-img="' + p.img + '"><img src="' + p.img + '" alt=""></button><button class="no-load" data-img="' + p.img2 + '"><img src="' + p.img2 + '" alt=""></button></div>' : "";
      return '<article class="card reveal tilt" data-id="' + p.id + '" data-cat="' + p.cat + '">' +
        '<div class="card-img"><span class="badge">' + esc(p.tag) + '</span><img loading="lazy" src="' + p.img + '" alt="' + esc(p.name) + '">' + thumbs + '</div>' +
        '<div class="card-body"><h3>' + esc(p.name) + '</h3><p>' + esc(p.desc) + '</p>' +
        '<ul>' + p.points.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul>' +
        '<div class="opt-label">' + esc(p.sizeLabel) + '</div><div class="chips">' + chips + '</div>' +
        '<div class="buy"><div class="price" data-price>' + kes(p.sizes[0].price) + '</div><button class="btn btn-primary add" type="button">🛒 Add to cart</button></div></div></article>';
    }).join("");
    $$(".card", host).forEach(function (card) {
      var p = findProduct(card.dataset.id), idx = 0, im = $(".card-img > img", card);
      card.addEventListener("click", function (e) {
        var chip = e.target.closest(".chip"), th = e.target.closest(".thumbs button"), add = e.target.closest(".add");
        if (chip) { idx = +chip.dataset.i; $$(".chip", card).forEach(function (c) { c.classList.toggle("on", c === chip); }); $("[data-price]", card).textContent = kes(p.sizes[idx].price); var si = p.sizes[idx].img; if (si && !$(".thumbs", card)) im.src = si; else if (!si && !$(".thumbs", card)) im.src = p.img; }
        if (th) { im.src = th.dataset.img; $$(".thumbs button", card).forEach(function (b) { b.classList.toggle("on", b === th); }); }
        if (add) Cart.add(p.id, p.sizes[idx].label, 1);
      });
    });
    setupReveal(); window.JKTilt(host);
  };

  load(); render();
})();
