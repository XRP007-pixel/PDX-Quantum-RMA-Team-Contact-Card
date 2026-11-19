// ==UserScript==
// @name         PDX Quantum RMA Team Contact Card
// @version      5.0.0
// @description  Floating team contact card for PDX Quantum RMA team
// @author       apriddek@amazon.com
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
  "use strict";

  // ============================================================
  // TEAM DATA
  // ============================================================

  var TEAM = {
    "Managers and Lead": [
      { name: "Tim",     alias: "fullert",  role: "Logistics Manager", color: "#E8A838" },
      { name: "Valerie", alias: "vvaljim",  role: "Logistics Manager", color: "#E8A838" },
      { name: "Care",    alias: "carevos",  role: "Quantum Lead",      color: "#00C9A7" }
    ],
    "Techs": [
      { name: "Emily",  alias: "temihowe", role: "Quantum RMA L3",   color: "#4FC3F7" },
      { name: "Jenni",  alias: "jwinnett", role: "Quantum RMA L3",   color: "#4FC3F7" },
      { name: "Riddek", alias: "apriddek", role: "Quantum RMA L3",   color: "#4FC3F7" },
      { name: "AbcDee", alias: "aabgutie", role: "Quantum RMA WBLP", color: "#CE93D8" }
    ]
  };

  var POCS = [
    { region: "South",   name: "Riddek", alias: "apriddek" },
    { region: "Central", name: "Jenni",  alias: "jwinnett" },
    { region: "East",    name: "Care",   alias: "carevos"  },
    { region: "West",    name: "Emily",  alias: "temihowe" },
    { region: "West",    name: "AbcDee", alias: "aabgutie" }
  ];

  var WIKI = "https://w.amazon.com/bin/view/PDX_Quantum_RMA";
  var SOP  = "https://w.amazon.com/bin/view/AWSCentralOps/Logistics/RMA/Quantum_RMA_Process/";
  var ME   = "apriddek";

  // ============================================================
  // STYLES
  // ============================================================

  var css = document.createElement("style");
  css.textContent = [
    "#qrma-btn {",
    "  position:fixed; bottom:24px; left:24px; z-index:99999;",
    "  width:auto; height:auto; padding:8px 14px;",
    "  border-radius:20px;",
    "  background:#0D1B2A; color:#00C9A7;",
    "  border:2px solid #00C9A7; font-size:11px;",
    "  cursor:pointer; font-weight:bold;",
    "  box-shadow:0 2px 10px rgba(0,201,167,0.4);",
    "  letter-spacing:0.5px; white-space:nowrap;",
    "}",
    "#qrma-btn:hover { background:#1a2e3f; }",
    "#qrma-panel {",
    "  position:fixed; bottom:60px; left:24px; z-index:99998;",
    "  width:320px; max-height:85vh; overflow-y:auto;",
    "  background:#0D1B2A; border:1px solid #00C9A7;",
    "  border-radius:14px; padding:14px; display:none;",
    "  box-shadow:0 4px 24px rgba(0,201,167,0.3);",
    "  font-family:sans-serif; font-size:13px; color:white;",
    "}",
    "#qrma-title {",
    "  color:#00C9A7; font-size:15px; font-weight:bold;",
    "  text-align:center; letter-spacing:1px; margin:0 0 2px;",
    "}",
    "#qrma-sub {",
    "  color:#aaa; font-size:10px;",
    "  text-align:center; margin-bottom:10px;",
    "}",
    "#qrma-tabs {",
    "  display:flex; gap:4px; margin-bottom:12px;",
    "}",
    ".qrma-tab {",
    "  flex:1; padding:5px; border-radius:6px;",
    "  border:1px solid #333; background:#1a2e3f;",
    "  color:#aaa; font-size:10px; font-weight:bold;",
    "  text-transform:uppercase; letter-spacing:0.5px;",
    "  text-align:center; cursor:pointer;",
    "}",
    ".qrma-tab.on { background:#00C9A7; color:#0D1B2A; border-color:#00C9A7; }",
    ".qrma-tab:hover:not(.on) { background:#243d52; }",
    ".qrma-page { display:none; }",
    ".qrma-page.on { display:block; }",
    "#qrma-search {",
    "  width:100%; padding:6px 10px; border-radius:8px;",
    "  border:1px solid #00C9A7; background:#1a2e3f;",
    "  color:white; font-size:12px; margin-bottom:10px;",
    "  box-sizing:border-box;",
    "}",
    "#qrma-search::placeholder { color:#555; }",
    ".qrma-group-label {",
    "  font-size:10px; text-transform:uppercase;",
    "  letter-spacing:1px; color:#E8A838; margin:10px 0 6px;",
    "}",
    ".qrma-card {",
    "  background:#1a2e3f; border-radius:10px;",
    "  padding:10px 12px; margin-bottom:6px;",
    "  border-left:3px solid #ccc;",
    "  display:flex; flex-direction:column; gap:4px;",
    "}",
    ".qrma-card-top {",
    "  display:flex; justify-content:space-between; align-items:center;",
    "}",
    ".qrma-card-name { font-weight:bold; font-size:14px; color:white; }",
    ".qrma-you {",
    "  background:#00C9A7; color:#0D1B2A;",
    "  font-size:9px; font-weight:bold;",
    "  padding:1px 6px; border-radius:10px;",
    "}",
    ".qrma-card-role { font-size:10px; }",
    ".qrma-poc-badge {",
    "  display:inline-block; font-size:9px;",
    "  padding:1px 6px; border-radius:10px;",
    "  margin-right:4px;",
    "}",
    ".qrma-row { display:flex; align-items:center; gap:6px; }",
    ".qrma-alias { font-size:12px; color:#4FC3F7; font-family:monospace; }",
    ".qrma-copy {",
    "  background:#0D1B2A; border:1px solid #4FC3F7;",
    "  color:#4FC3F7; border-radius:4px;",
    "  padding:1px 7px; font-size:10px; cursor:pointer;",
    "}",
    ".qrma-copy:hover { background:#1a2e3f; }",
    ".qrma-slack {",
    "  background:#4A154B; border:none; color:white;",
    "  border-radius:4px; padding:1px 7px;",
    "  font-size:10px; cursor:pointer; text-decoration:none;",
    "}",
    ".qrma-slack:hover { background:#6a2a6b; }",
    ".qrma-box {",
    "  background:#1a2e3f; border-radius:10px;",
    "  padding:12px; margin-bottom:10px;",
    "  border-left:3px solid #00C9A7;",
    "}",
    ".qrma-box.amber { border-left-color:#E8A838; }",
    ".qrma-box.red   { border-left-color:#E74C3C; }",
    ".qrma-box h4 {",
    "  font-size:12px; text-transform:uppercase;",
    "  letter-spacing:1px; margin:0 0 8px;",
    "}",
    ".qrma-box.amber h4 { color:#E8A838; }",
    ".qrma-box.red h4   { color:#E74C3C; }",
    ".qrma-box:not(.amber):not(.red) h4 { color:#00C9A7; }",
    ".qrma-box p {",
    "  color:#ccc; font-size:11px;",
    "  line-height:1.6; margin:0 0 6px;",
    "}",
    ".qrma-box ul {",
    "  margin:4px 0; padding-left:16px;",
    "  color:#ccc; font-size:11px; line-height:1.8;",
    "}",
    ".qrma-sop-link {",
    "  display:inline-block; margin-top:6px;",
    "  background:#E74C3C; color:white;",
    "  border-radius:6px; padding:4px 10px;",
    "  font-size:11px; font-weight:bold;",
    "  text-decoration:none; cursor:pointer;",
    "}",
    ".qrma-sop-link:hover { background:#c0392b; }",
    ".qrma-table {",
    "  width:100%; border-collapse:collapse;",
    "  font-size:11px; margin-top:4px;",
    "}",
    ".qrma-table th {",
    "  background:#0D1B2A; color:#00C9A7;",
    "  padding:5px 8px; text-align:left;",
    "  font-size:10px; text-transform:uppercase; letter-spacing:1px;",
    "}",
    ".qrma-table td {",
    "  padding:5px 8px;",
    "  border-bottom:1px solid #0D1B2A; color:#ccc;",
    "}",
    ".qrma-table tr:nth-child(even) td { background:#0d1f2e; }",
    ".qrma-me { color:#00C9A7; font-weight:bold; }",
    ".qrma-wiki {",
    "  display:block; width:100%; padding:7px;",
    "  background:#00C9A7; color:#0D1B2A;",
    "  border:none; border-radius:8px; font-weight:bold;",
    "  font-size:12px; text-align:center;",
    "  margin-top:10px; text-decoration:none;",
    "  box-sizing:border-box; cursor:pointer;",
    "}",
    ".qrma-wiki:hover { background:#00a888; }",
    "hr.qrma-line { border:none; border-top:1px solid #1a2e3f; margin:10px 0; }"
  ].join("\n");
  document.head.appendChild(css);

  // ============================================================
  // HELPER FUNCTIONS
  // ============================================================

  function make(tag, opts) {
    var node = document.createElement(tag);
    opts = opts || {};
    if (opts.id)     { node.id = opts.id; }
    if (opts.cls)    { node.className = opts.cls; }
    if (opts.text)   { node.textContent = opts.text; }
    if (opts.href)   { node.href = opts.href; }
    if (opts.target) { node.target = opts.target; }
    if (opts.type)   { node.type = opts.type; }
    if (opts.ph)     { node.placeholder = opts.ph; }
    if (opts.css)    { node.style.cssText = opts.css; }
    if (opts.data) {
      Object.keys(opts.data).forEach(function (k) {
        node.dataset[k] = opts.data[k];
      });
    }
    return node;
  }

  function add(parent) {
    var children = Array.prototype.slice.call(arguments, 1);
    children.forEach(function (c) { if (c) parent.appendChild(c); });
    return parent;
  }

  // ============================================================
  // BUILD PANEL
  // ============================================================

  var panel = make("div", { id: "qrma-panel" });

  add(panel,
    make("div", { id: "qrma-title", text: "PDX Quantum RMA" }),
    make("div", { id: "qrma-sub",   text: "Meet The Team"   })
  );

  // Tabs
  var tabs    = make("div", { id: "qrma-tabs" });
  var tabTeam = make("div", { cls: "qrma-tab on",  data: { tab: "team" }, text: "Team"  });
  var tabPoc  = make("div", { cls: "qrma-tab",     data: { tab: "pocs" }, text: "POCs"  });
  var tabInfo = make("div", { cls: "qrma-tab",     data: { tab: "info" }, text: "Info"  });
  add(tabs, tabTeam, tabPoc, tabInfo);
  panel.appendChild(tabs);

  // ---- TEAM PAGE ----
  var pageTeam  = make("div", { cls: "qrma-page on", id: "page-team" });
  var searchBox = make("input", { id: "qrma-search", type: "text", ph: "Search name, alias or role..." });
  var cardsArea = make("div", { id: "qrma-cards" });
  add(pageTeam, searchBox, cardsArea);

  // ---- POCS PAGE ----
  var pagePoc  = make("div", { cls: "qrma-page", id: "page-pocs" });
  var pocBox   = make("div", { cls: "qrma-box" });
  var pocTitle = make("h4",  { text: "Points of Contact by Region" });
  var pocDesc  = make("p",   { text: "Current POCs following recent tech moves on the team:" });
  var pocTable = make("table", { cls: "qrma-table" });

  var thead = make("thead");
  var hrow  = make("tr");
  add(hrow, make("th", { text: "Region" }), make("th", { text: "POC" }));
  add(thead, hrow);

  var tbody = make("tbody");
  POCS.forEach(function (p) {
    var row    = make("tr");
    var tdReg  = make("td");
    var strong = make("strong", { css: "color:white", text: p.region });
    tdReg.appendChild(strong);
    var tdPoc  = make("td");
    if (p.alias === ME) {
      tdPoc.className   = "qrma-me";
      tdPoc.textContent = p.name + " (You)";
    } else {
      tdPoc.textContent = p.name;
    }
    add(row, tdReg, tdPoc);
    tbody.appendChild(row);
  });

  add(pocTable, thead, tbody);
  add(pocBox, pocTitle, pocDesc, pocTable);
  var wikiBtn1 = make("a", { cls: "qrma-wiki", href: WIKI, target: "_blank", text: "Open Team Wiki Page" });
  add(pagePoc, pocBox, wikiBtn1);

  // ---- INFO PAGE ----
  var pageInfo = make("div", { cls: "qrma-page", id: "page-info" });

  // Who We Are block
  var whoBox = make("div", { cls: "qrma-box" });
  var whoH4  = make("h4",  { text: "Who We Are" });
  var whoP1  = make("p",   { text: "The Quantum team was created in Q2 in response to the large influx of tape drives that needed processing as a result of the REIN-26 project." });
  var whoP2  = make("p",   { text: "Our team owns the processing and shipping of devices within the Glacier spaces, covering the full path for a device whether it is going:" });
  var whoUL  = make("ul");
  add(whoUL,
    make("li", { text: "Back to the vendor" }),
    make("li", { text: "Out for e-waste" }),
    make("li", { text: "Out in bulk shipments to be refurbished" })
  );
  var whoP3 = make("p", { text: "Our goal: keeping the Glacier spaces safe for every team to work out of." });
  add(whoBox, whoH4, whoP1, whoP2, whoUL, whoP3);

  // Scope and Work Together block
  var scopeBox = make("div", { cls: "qrma-box amber" });
  var scopeH4  = make("h4",  { text: "Scope and Work Together" });
  var scopeP1  = make("p",   { text: "Quantum wants a collaborative relationship with DCO (Data Center Operations). We have been operating outside of scope by performing removals for the Ski Lodges. If support is needed for the Igloos, we absolutely want to help. Just communicate with us so we can be there when you need us since we do cover all PDX." });
  add(scopeBox, scopeH4, scopeP1);

  // DCO SOP block
  var dcoBox  = make("div", { cls: "qrma-box red" });
  var dcoH4   = make("h4",  { text: "DCO Standard Operating Procedure" });
  var dcoP1   = make("p",   { text: "The current SOP (Standard Operating Procedure) states that DCO (Data Center Operations) is responsible for the removal of parts after a break-fix." });
  var sopLink = make("a",   { cls: "qrma-sop-link", href: SOP, target: "_blank", text: "View Full SOP" });
  add(dcoBox, dcoH4, dcoP1, sopLink);

  var wikiBtn2 = make("a", { cls: "qrma-wiki", href: WIKI, target: "_blank", text: "Open Team Wiki Page" });
  add(pageInfo, whoBox, scopeBox, dcoBox, wikiBtn2);

  // Add all pages to panel
  add(panel, pageTeam, pagePoc, pageInfo);
  document.body.appendChild(panel);

  // ============================================================
  // RENDER TEAM CARDS
  // ============================================================

  function renderCards(filter) {
    var area  = document.getElementById("qrma-cards");
    area.innerHTML = "";
    var query = (filter || "").toLowerCase().trim();

    Object.keys(TEAM).forEach(function (group) {
      var members = TEAM[group];
      var matched = members.filter(function (m) {
        return (
          m.name.toLowerCase().indexOf(query)  !== -1 ||
          m.alias.toLowerCase().indexOf(query) !== -1 ||
          m.role.toLowerCase().indexOf(query)  !== -1
        );
      });
      if (matched.length === 0) return;

      var label = make("div", { cls: "qrma-group-label", text: group });
      area.appendChild(label);

      matched.forEach(function (m) {
        var isMe = m.alias === ME;
        var poc  = POCS.filter(function (p) { return p.alias === m.alias; });

        var card = make("div", { cls: "qrma-card" });
        card.style.borderLeftColor = m.color;

        // Top row
        var top    = make("div", { cls: "qrma-card-top" });
        var nameEl = make("span", { cls: "qrma-card-name", text: m.name });
        top.appendChild(nameEl);
        if (isMe) {
          top.appendChild(make("span", { cls: "qrma-you", text: "YOU" }));
        }
        card.appendChild(top);

        // Role
        var roleEl = make("div", { cls: "qrma-card-role", text: m.role });
        roleEl.style.color = m.color;
        card.appendChild(roleEl);

        // POC badges
        poc.forEach(function (p) {
          var badge = make("span", { cls: "qrma-poc-badge", text: "POC: " + p.region });
          badge.style.border     = "1px solid " + m.color;
          badge.style.color      = m.color;
          badge.style.background = "#0D1B2A";
          card.appendChild(badge);
        });

        // Alias row
        var row      = make("div", { cls: "qrma-row" });
        var aliasEl  = make("span", { cls: "qrma-alias", text: "@" + m.alias });
        var copyBtn  = make("button", { cls: "qrma-copy", text: "Copy", data: { alias: m.alias } });
        var slackBtn = make("a", {
          cls:    "qrma-slack",
          href:   "https://app.slack.com/client/T00000000?search=" + m.alias,
          target: "_blank",
          text:   "Slack"
        });
        add(row, aliasEl, copyBtn, slackBtn);
        card.appendChild(row);
        area.appendChild(card);
      });
    });

    if (area.children.length === 0) {
      area.appendChild(make("div", {
        css:  "color:#888;text-align:center;padding:10px;",
        text: "No results found."
      }));
    }
  }

  // ============================================================
  // COPY BUTTON HANDLER
  // ============================================================

  document.getElementById("qrma-cards").addEventListener("click", function (e) {
    if (e.target.classList.contains("qrma-copy")) {
      var alias = e.target.dataset.alias;
      navigator.clipboard.writeText("@" + alias);
      e.target.textContent = "Copied!";
      setTimeout(function () { e.target.textContent = "Copy"; }, 2000);
    }
  });

  // ============================================================
  // SEARCH HANDLER
  // ============================================================

  document.getElementById("qrma-search").addEventListener("input", function (e) {
    renderCards(e.target.value);
  });

  // ============================================================
  // TAB SWITCHING
  // ============================================================

  document.getElementById("qrma-tabs").addEventListener("click", function (e) {
    if (!e.target.classList.contains("qrma-tab")) return;
    var tab = e.target.getAttribute("data-tab");

    document.querySelectorAll(".qrma-tab").forEach(function (t) {
      t.classList.remove("on");
    });
    document.querySelectorAll(".qrma-page").forEach(function (p) {
      p.classList.remove("on");
    });

    e.target.classList.add("on");
    document.getElementById("page-" + tab).classList.add("on");
  });

  // ============================================================
  // TOGGLE BUTTON
  // ============================================================

  var btn = make("button", {
    id:    "qrma-btn",
    title: "PDX Quantum RMA Team Card",
    text:  "Quantum POC's"
  });

  btn.addEventListener("click", function () {
    var open = panel.style.display === "block";
    panel.style.display = open ? "none" : "block";
    if (!open) renderCards();
  });
  document.body.appendChild(btn);

  // ============================================================
  // INIT
  // ============================================================

  renderCards();

})();
