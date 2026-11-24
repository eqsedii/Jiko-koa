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
  var cfg = window.JK_POPUP || { first: 9000, min: 14000, max: 32000, show: 5000, max_per_visit: 15 };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pool = [], shown = 0, timer, hideT, el;

  function next() {
    if (!pool.length) { pool = names.slice(); for (var i = pool.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = pool[i]; pool[i] = pool[j]; pool[j] = t; } }
    return pool.pop();
  }
  function build() {
    el = document.createElement("div");
    el.className = "order-pop no-load"; el.setAttribute("role", "status"); el.setAttribute("aria-live", "polite");
    el.innerHTML = '<div class="op-av" id="opAv"></div><div class="op-txt"><b>\uD83C\uDF8A MADE AN ORDER</b><span id="opName"></span></div><button class="op-x no-load" aria-label="Close">&times;</button>';
    document.body.appendChild(el);
    el.querySelector(".op-x").onclick = function () { hide(); schedule(); };
  }
  function hide() { clearTimeout(hideT); if (el) el.classList.remove("show"); }
  function busy() { return document.hidden || document.body.classList.contains("lock") || document.body.classList.contains("nav-open"); }
  function show() {
    if (shown >= cfg.max_per_visit) return;
    if (busy()) { schedule(4000); return; }
    var n = next();
    if (!el) build();
    el.querySelector("#opName").textContent = n;
    el.querySelector("#opAv").textContent = n.charAt(0);
    el.classList.add("show"); shown++;
    hideT = setTimeout(function () { hide(); schedule(); }, cfg.show);
  }
  function schedule(ms) {
    clearTimeout(timer);
    timer = setTimeout(show, ms || (cfg.min + Math.random() * (cfg.max - cfg.min)));
  }
  window.addEventListener("load", function () { schedule(cfg.first); });
})();
