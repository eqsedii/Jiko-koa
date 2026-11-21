/* JIKOKOA LIMITED – product catalogue.
   To change a price or add a product, edit this file only. Prices are in KSh. */
window.JK_PRODUCTS = [
  {
    id: "jikokoa",
    cat: "jikos",
    name: "Jikokoa",
    tag: "Best seller",
    img: "assets/img/jikokoa.jpg",
    desc: "The original fuel-efficient charcoal jiko. Burns less charcoal, heats fast and keeps the heat in, so every bag lasts longer.",
    points: ["Insulated, fuel-saving design", "Sturdy side handles", "Air-flow door to control the fire"],
    sizeLabel: "Size",
    sizes: [
      { label: "Small", price: 1000 },
      { label: "Medium", price: 1500 },
      { label: "Large", price: 2000 }
    ]
  },
  {
    id: "ecoa",
    cat: "jikos",
    name: "Ecoa Char",
    tag: "New look of Jikokoa",
    img: "assets/img/ecoa-char.jpg",
    desc: "Jikokoa is now Ecoa. The same trusted efficiency in a modern stainless and black finish with fold-in handles.",
    points: ["Modern stainless body", "Cooks quickly, burns less charcoal", "Easy-clean ash tray"],
    sizeLabel: "Size",
    sizes: [
      { label: "Small", price: 1150 },
      { label: "Medium", price: 1750 },
      { label: "Large", price: 2250 }
    ]
  },
  {
    id: "jiko-mama-yao",
    cat: "jikos",
    name: "Jiko Mama Yao",
    tag: "Family favourite",
    img: "assets/img/jiko-mama-yao.jpg",
    desc: "A dependable everyday family jiko for daily cooking. Strong, easy to light and economical on charcoal.",
    points: ["Built for everyday home cooking", "Economical on charcoal", "Available in three sizes"],
    sizeLabel: "Size",
    sizes: [
      { label: "Small", price: 1050 },
      { label: "Medium", price: 1650 },
      { label: "Large", price: 2150 }
    ]
  },
  {
    id: "pressure-cooker",
    cat: "cookers",
    name: "Pressure Cooker",
    tag: "3L to 35L",
    img: "assets/img/pressure-cooker.jpg",
    desc: "Heavy-duty aluminium pressure cookers that cut cooking time for beans, ngararimu, meat and githeri and save fuel. From home kitchens to hotels, schools and institutions.",
    points: ["Safety valve and locking lid", "Cooks beans and meat in a fraction of the time", "13 sizes, from family to institution"],
    sizeLabel: "Capacity",
    sizes: [
      { label: "3 Litres", price: 1500, img: "assets/img/pressure-cooker-small.jpg" },
      { label: "5 Litres", price: 2500, img: "assets/img/pressure-cooker-small.jpg" },
      { label: "7 Litres", price: 3500, img: "assets/img/pressure-cooker-small.jpg" },
      { label: "9 Litres", price: 4500 },
      { label: "11 Litres", price: 5500 },
      { label: "13 Litres", price: 6500 },
      { label: "15 Litres", price: 7500 },
      { label: "17 Litres", price: 8500 },
      { label: "19 Litres", price: 9500 },
      { label: "21 Litres", price: 10500 },
      { label: "25 Litres", price: 13500 },
      { label: "29 Litres", price: 15500 },
      { label: "35 Litres", price: 21500 }
    ]
  },
  {
    id: "induction-set",
    cat: "cookers",
    name: "Ecoa Induction Cooker Set",
    tag: "Complete set",
    img: "assets/img/induction-cooker-set.jpg",
    desc: "A complete Ecoa induction cooking set: an induction cooktop with touch controls, two stainless steel pots with glass lids and a stainless steel frying pan.",
    points: ["Induction cooktop with touch controls", "2 stainless steel pots with glass lids", "Stainless steel frying pan included"],
    sizeLabel: "Option",
    sizes: [{ label: "Full set", price: 6500 }]
  },
  {
    id: "ecoa-grill",
    cat: "grills",
    name: "Ecoa Grill",
    tag: "From the makers of Jikokoa",
    img: "assets/img/ecoa-grill.jpg",
    img2: "assets/img/ecoa-grill-2.jpg",
    desc: "A portable stainless steel charcoal grill that sits on your Ecoa jiko. Perfect for maize, fish, nyama choma and weekend get-togethers.",
    points: ["Stainless steel, rust resistant", "Carry handles for easy moving", "Fits Ecoa jikos"],
    sizeLabel: "Size",
    sizes: [
      { label: "Small", price: 450 },
      { label: "Medium", price: 950 },
      { label: "Large", price: 1450 }
    ]
  },
  {
    id: "nyama-choma-grill",
    cat: "rotisserie",
    name: "Mild Steel Nyama Choma Grill",
    tag: "Charcoal grill",
    img: "assets/img/grill-mild-steel.jpg",
    desc: "A strong mild steel charcoal grill with a hinged lid, wide grilling surface and a rear air vent. Built for butcheries, joints and serious nyama choma.",
    points: ["Heavy mild steel body", "Hinged lid with vent", "Draw-out ash drawer"],
    sizeLabel: "Model",
    sizes: [{ label: "Standard", price: 10500 }]
  },
  {
    id: "adjustable-grill",
    cat: "rotisserie",
    name: "Adjustable Stainless Steel Grill",
    tag: "Charcoal rotisserie grill",
    img: "assets/img/grill-adjustable.jpg",
    img2: "assets/img/rotisserie-skewers.jpg",
    desc: "A premium charcoal grill with a hand-crank that raises and lowers the grate, so you control the heat without moving the meat. Lower shelf for trays and tools.",
    points: ["Crank to adjust grilling height", "Ash drawer and storage shelf", "Made for heavy commercial use"],
    sizeLabel: "Model",
    sizes: [{ label: "Standard", price: 25500 }]
  }
];

window.JK_COUNTIES = [
  "Baringo","Bomet","Bungoma","Busia","Elgeyo-Marakwet","Embu","Garissa","Homa Bay","Isiolo","Kajiado",
  "Kakamega","Kericho","Kiambu","Kilifi","Kirinyaga","Kisii","Kisumu","Kitui","Kwale","Laikipia",
  "Lamu","Machakos","Makueni","Mandera","Marsabit","Meru","Migori","Mombasa","Murang'a","Nairobi",
  "Nakuru","Nandi","Narok","Nyamira","Nyandarua","Nyeri","Samburu","Siaya","Taita-Taveta","Tana River",
  "Tharaka-Nithi","Trans-Nzoia","Turkana","Uasin Gishu","Vihiga","Wajir","West Pokot"
];

window.JK_CONFIG = {
  whatsapp: "254751986220",
  phoneCall: "+254746602244",
  maps: "https://maps.app.goo.gl/tV4WfYy22N3AazrHA?g_st=ac"
};
