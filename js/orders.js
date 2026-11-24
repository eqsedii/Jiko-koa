/* JIKOKOA LIMITED: "MADE AN ORDER" popups.
   Add or remove names in the list below (only customers who agreed to be shown). */
window.JK_ORDERS = [
 "Peter Kamau",
 "James Mwangi",
 "John Njoroge",
 "David Kariuki",
 "Joseph Maina",
 "Samuel Kinyua",
 "Brian Mbugua",
 "Dennis Njenga",
 "Mary Wanjiku",
 "Grace Nyambura",
 "Jane Wambui",
 "Esther Muthoni",
 "Lucy Wangari",
 "Faith Wairimu",
 "Mercy Gathoni",
 "Daniel Gichuru",
 "Patrick Karanja",
 "George Gachanja",
 "Ann Wanjiru",
 "Ruth Njeri",
 "Michael Kimani",
 "Eric Murimi",
 "Caroline Nyokabi",
 "Cynthia Wangui",
 "Victor Kihara",
 "Brian Kipchumba",
 "David Kiptoo",
 "Samuel Kiprono",
 "Peter Kibet",
 "John Kiplagat",
 "Daniel Kipkemoi",
 "Dennis Kipkirui",
 "Joseph Kiprotich",
 "Patrick Kipngetich",
 "Collins Kipkoech",
 "Mercy Chebet",
 "Faith Cherono",
 "Grace Jepkosgei",
 "Mary Chepkoech",
 "Jane Jepchirchir",
 "Esther Chepkemoi",
 "Irene Chepngeno",
 "Lydia Cheptoo",
 "Purity Chepkirui",
 "Monica Chepketer",
 "Victor Kurgat",
 "Martin Rono",
 "Paul Langat",
 "George Bett",
 "Anthony Rotich",
 "Brian Otieno",
 "Peter Odhiambo",
 "John Ochieng",
 "David Onyango",
 "Joseph Ouma",
 "Samuel Omondi",
 "James Okoth",
 "Dennis Owuor",
 "Patrick Were",
 "Michael Ogola",
 "Mary Achieng",
 "Grace Atieno",
 "Jane Adhiambo",
 "Faith Akoth",
 "Mercy Awuor",
 "Esther Anyango",
 "Lucy Awino",
 "Ruth Apiyo",
 "Cynthia Nyakio",
 "Ann Nyaruai",
 "Daniel Oduor",
 "Eric Okwach",
 "Victor Obiero",
 "George Owino",
 "Caroline Akinyi",
 "John Wekesa",
 "Brian Wafula",
 "Peter Barasa",
 "David Simiyu",
 "Joseph Khaemba",
 "Samuel Makokha",
 "Dennis Wanyonyi",
 "Patrick Mukhwana",
 "James Lusweti",
 "Michael Khisa",
 "Mary Naliaka",
 "Grace Nasimiyu",
 "Jane Nekesa",
 "Faith Nafula",
 "Mercy Nanjala",
 "Esther Nambuye",
 "Lucy Wanjala",
 "Ruth Mukhwana",
 "Ann Khakasa",
 "Cynthia Nandwa",
 "Daniel Wamalwa",
 "Eric Shikuku",
 "Victor Were",
 "George Amukoye",
 "Caroline Makokha",
 "Peter Mutua",
 "John Musyoka",
 "David Muli",
 "Joseph Kioko",
 "Samuel Munyao",
 "James Kilonzo",
 "Brian Makau",
 "Dennis Nzomo",
 "Patrick Nzioka",
 "Michael Kyalo",
 "Mary Mutheu",
 "Grace Muthoki",
 "Jane Mwende",
 "Faith Nduku",
 "Mercy Kavindu",
 "Esther Mumbua",
 "Lucy Syombua",
 "Ruth Mwikali",
 "Ann Ndanu",
 "Cynthia Wavinya",
 "Daniel Muema",
 "Eric Muthama",
 "Victor Kituku",
 "George Mbiti",
 "Caroline Kasyoka",
 "Brian Omwenga",
 "Peter Mogaka",
 "John Nyamweya",
 "David Bosire",
 "Joseph Ondieki",
 "Samuel Marube",
 "James Onkoba",
 "Dennis Nyachae",
 "Patrick Gesare",
 "Michael Ongeri",
 "Mary Nyaboke",
 "Grace Moraa",
 "Jane Kerubo",
 "Faith Kwamboka",
 "Mercy Nyanchera",
 "Esther Kemunto",
 "Lucy Bosibori",
 "Ruth Nyamoki",
 "Ann Moraa",
 "Cynthia Nyabuto",
 "Daniel Osiemo",
 "Eric Matoke",
 "Victor Ogeto",
 "George Okeri",
 "Caroline Nyaboke"
];

(function () {
  "use strict";
  var names = window.JK_ORDERS || [];
  if (!names.length) return;
  var cfg = window.JK_POPUP || { first: 7000, min: 14000, max: 30000, show: 6000, max_per_visit: 15 };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pool = [], shown = 0, timer, hideT, el, ctx = null, unlocked = false, muted = false;
  try { muted = localStorage.getItem("jk_mute") === "1"; } catch (e) {}

  /* styles live here so the popup never depends on style.css being up to date */
  var st = document.createElement("style");
  st.textContent =
    ".order-pop{position:fixed;z-index:9000;left:50%;top:calc(env(safe-area-inset-top,0px) + 76px);width:min(92vw,380px);display:flex;align-items:center;gap:14px;padding:14px 44px 18px 14px;background:linear-gradient(135deg,#2a1406,#140d0a 70%);border:1px solid #ff8a2a;border-radius:20px;color:#f6efe6;font-family:Inter,system-ui,sans-serif;box-shadow:0 18px 50px rgba(0,0,0,.65),0 0 0 4px rgba(255,106,19,.18),0 0 34px rgba(255,106,19,.45);overflow:hidden;opacity:0;visibility:hidden;transform:translate(-50%,-30px) scale(.9);transition:opacity .35s,transform .55s cubic-bezier(.2,1.4,.4,1),visibility .35s;pointer-events:none}" +
    ".order-pop.show{opacity:1;visibility:visible;transform:translate(-50%,0) scale(1);pointer-events:auto}" +
    "@media(min-width:900px){.order-pop{left:24px;top:auto;bottom:24px;transform:translate(-40px,0) scale(.9)}.order-pop.show{transform:none}}" +
    ".order-pop .op-av{position:relative;flex:none;width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#ff6a13,#ffc83d);color:#1a0b00;display:grid;place-items:center;font:800 1.7rem 'Barlow Condensed',Impact,sans-serif}" +
    ".order-pop.show .op-av::after{content:'';position:absolute;inset:-4px;border-radius:50%;border:2px solid #ffb21e;animation:opRing 1.4s ease-out infinite}" +
    "@keyframes opRing{0%{transform:scale(.9);opacity:.9}100%{transform:scale(1.5);opacity:0}}" +
    ".order-pop .op-txt{display:flex;flex-direction:column;gap:3px;min-width:0;line-height:1.2}" +
    ".order-pop .op-tag{font-size:.78rem;font-weight:800;letter-spacing:.1em;color:#ffc83d;white-space:nowrap}" +
    ".order-pop .op-name{font:800 1.35rem 'Barlow Condensed',Impact,sans-serif;text-transform:uppercase;letter-spacing:.02em;line-height:1.05;word-break:break-word}" +
    ".order-pop .op-sub{font-size:.78rem;color:#bfae9d}" +
    ".order-pop button{position:absolute;background:none;border:0;color:#bfae9d;cursor:pointer;line-height:1;padding:4px}" +
    ".order-pop .op-x{top:6px;right:10px;font-size:1.5rem}" +
    ".order-pop .op-snd{top:34px;right:10px;font-size:1.05rem}" +
    ".order-pop .op-bar{position:absolute;left:0;bottom:0;height:4px;width:100%;background:linear-gradient(90deg,#ff6a13,#ffc83d);transform-origin:left}" +
    ".order-pop.show .op-bar{animation:opBar var(--opdur,6s) linear forwards}" +
    "@keyframes opBar{to{transform:scaleX(0)}}" +
    ".op-conf{position:absolute;width:7px;height:7px;border-radius:2px;pointer-events:none;animation:opConf .9s ease-out forwards}" +
    "@keyframes opConf{0%{transform:translate(0,0) rotate(0);opacity:1}100%{transform:translate(var(--dx),var(--dy)) rotate(260deg);opacity:0}}" +
    "@media(prefers-reduced-motion:reduce){.order-pop,.order-pop *{animation:none!important;transition:opacity .2s!important}}";
  document.head.appendChild(st);

  /* chime (generated in the browser, no sound file needed) */
  function unlock() {
    if (unlocked) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      ctx = new AC(); if (ctx.state === "suspended") ctx.resume();
      unlocked = true;
    } catch (e) {}
  }
  ["pointerdown", "touchstart", "keydown", "click"].forEach(function (ev) { window.addEventListener(ev, unlock, { passive: true }); });
  function chime() {
    if (muted || !unlocked || !ctx) return;
    try {
      if (ctx.state === "suspended") ctx.resume();
      var t0 = ctx.currentTime + 0.02;
      [[784, 0], [1175, 0.11], [1568, 0.23]].forEach(function (n) {
        var o = ctx.createOscillator(), g = ctx.createGain(), o2 = ctx.createOscillator();
        o.type = "sine"; o2.type = "triangle"; o.frequency.value = n[0]; o2.frequency.value = n[0] * 2;
        g.gain.setValueAtTime(0.0001, t0 + n[1]);
        g.gain.exponentialRampToValueAtTime(0.22, t0 + n[1] + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + n[1] + 0.55);
        o.connect(g); o2.connect(g); g.connect(ctx.destination);
        o.start(t0 + n[1]); o2.start(t0 + n[1]); o.stop(t0 + n[1] + 0.6); o2.stop(t0 + n[1] + 0.6);
      });
    } catch (e) {}
  }

  function next() {
    if (!pool.length) { pool = names.slice(); for (var i = pool.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = pool[i]; pool[i] = pool[j]; pool[j] = t; } }
    return pool.pop();
  }
  function snd() { var b = el.querySelector(".op-snd"); b.textContent = muted ? "🔇" : "🔔"; }
  function build() {
    el = document.createElement("div");
    el.className = "order-pop no-load"; el.setAttribute("role", "status"); el.setAttribute("aria-live", "polite");
    el.innerHTML = '<div class="op-av"></div><div class="op-txt"><span class="op-tag">🎊 MADE AN ORDER</span><span class="op-name"></span><span class="op-sub">Thank you for choosing Jikokoa</span></div>' +
      '<button class="op-x no-load" aria-label="Close">&times;</button><button class="op-snd no-load" aria-label="Toggle sound"></button><div class="op-bar"></div>';
    document.body.appendChild(el);
    el.querySelector(".op-x").onclick = function () { hide(); schedule(); };
    el.querySelector(".op-snd").onclick = function () {
      muted = !muted; try { localStorage.setItem("jk_mute", muted ? "1" : "0"); } catch (e) {} snd();
    };
    snd();
  }
  function confetti() {
    if (reduce) return;
    var colors = ["#ff6a13", "#ffc83d", "#ffffff", "#25d366", "#ff4d6d"];
    for (var i = 0; i < 16; i++) {
      var c = document.createElement("i"); c.className = "op-conf";
      c.style.left = "40px"; c.style.top = "36px"; c.style.background = colors[i % colors.length];
      c.style.setProperty("--dx", (Math.random() * 300 - 40) + "px"); c.style.setProperty("--dy", (Math.random() * 90 - 45) + "px");
      el.appendChild(c); setTimeout((function (n) { return function () { if (n.parentNode) n.parentNode.removeChild(n); }; })(c), 1000);
    }
  }
  function hide() { clearTimeout(hideT); if (el) el.classList.remove("show"); }
  function busy() { return document.hidden || document.body.classList.contains("lock") || document.body.classList.contains("nav-open"); }
  function show() {
    if (shown >= cfg.max_per_visit) return;
    if (busy()) { schedule(4000); return; }
    var n = next();
    if (!el) build();
    el.querySelector(".op-name").textContent = n;
    el.querySelector(".op-av").textContent = n.charAt(0);
    el.style.setProperty("--opdur", (cfg.show / 1000) + "s");
    el.classList.remove("show"); void el.offsetWidth;
    el.classList.add("show"); shown++;
    chime(); confetti();
    clearTimeout(hideT); hideT = setTimeout(function () { hide(); schedule(); }, cfg.show);
  }
  function schedule(ms) {
    clearTimeout(timer);
    timer = setTimeout(show, ms || (cfg.min + Math.random() * (cfg.max - cfg.min)));
  }
  window.addEventListener("load", function () { schedule(cfg.first); });
})();
