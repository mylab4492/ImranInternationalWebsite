/*
 * "Apply for jobs" pop-up + floating button linking to the job portal (imranjobs.com).
 *
 * Add one line before </body> on any page:
 *   <script src="js/jobportal-popup.js" data-color="#0A84CB" data-accent="#ffd76a"
 *           data-tag="..." data-button="..." data-title="..." data-text="..." defer></script>
 *
 * - The pop-up opens once, a few seconds after the visitor arrives.
 * - After it is closed it stays hidden until the browser is closed (the floating button still reopens it).
 * - Everything is self-contained (own styles, no jQuery/Bootstrap needed) and prefixed "jpp-".
 */
(function () {
  var PORTAL = "https://imranjobs.com";
  var DELAY_MS = 4000;
  var COOKIE = "jobportalPopupClosed";

  var script = document.currentScript;
  var opt = function (name, fallback) {
    return (script && script.getAttribute("data-" + name)) || fallback;
  };
  var color = opt("color", "#0A84CB");
  var accent = opt("accent", "#ffd76a");
  var tag = opt("tag", "Overseas Job Openings");
  var button = opt("button", "Find Jobs Abroad");
  var title = opt("title", "Looking for a job in the Gulf?");
  var text = opt("text", "Register free on our job portal, upload your documents once and we will contact you when a suitable job is available.");
  var source = opt("source", location.hostname.replace(/^www\./, ""));
  var link = function (path) {
    return PORTAL + path + "?utm_source=" + encodeURIComponent(source) + "&utm_medium=popup";
  };

  // A session cookie (no expiry date) is deleted when the browser is closed, so the pop-up
  // shows once per browser session and not again on every page while the visitor browses.
  function closedRecently() {
    return document.cookie.split("; ").indexOf(COOKIE + "=1") !== -1;
  }
  function rememberClosed() {
    document.cookie = COOKIE + "=1; path=/; SameSite=Lax";
  }
  function forgetClosed() {
    document.cookie = COOKIE + "=; path=/; max-age=0; SameSite=Lax";
  }

  var css =
    ".jpp-fab{position:fixed;left:18px;bottom:18px;z-index:99998;display:flex;align-items:center;gap:8px;padding:12px 18px;border:0;border-radius:50px;" +
      "background:" + color + ";color:#fff;font:600 14px/1 -apple-system,'Segoe UI',Roboto,Arial,sans-serif;cursor:pointer;" +
      "box-shadow:0 8px 24px rgba(0,0,0,.25);animation:jpp-pulse 2.4s ease-out infinite;transition:transform .15s ease}" +
    ".jpp-fab:hover{transform:translateY(-2px)}" +
    ".jpp-fab svg{width:18px;height:18px;fill:currentColor}" +
    "@keyframes jpp-pulse{0%{box-shadow:0 8px 24px rgba(0,0,0,.25),0 0 0 0 " + color + "88}70%{box-shadow:0 8px 24px rgba(0,0,0,.25),0 0 0 14px " + color + "00}100%{box-shadow:0 8px 24px rgba(0,0,0,.25),0 0 0 0 " + color + "00}}" +
    ".jpp-overlay{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;" +
      "background:rgba(8,20,40,.6);opacity:0;visibility:hidden;transition:opacity .25s ease,visibility .25s ease}" +
    ".jpp-overlay.jpp-open{opacity:1;visibility:visible}" +
    ".jpp-modal{position:relative;width:100%;max-width:440px;border-radius:18px;overflow:hidden;background:#fff;text-align:center;" +
      "font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;box-shadow:0 24px 60px rgba(0,0,0,.4);transform:translateY(20px) scale(.97);transition:transform .25s ease}" +
    ".jpp-open .jpp-modal{transform:none}" +
    ".jpp-head{padding:28px 24px 22px;background:linear-gradient(135deg," + color + ",#0b2a44);color:#fff}" +
    ".jpp-head img{width:64px;height:64px;border-radius:14px;border:2px solid " + accent + ";background:#fff;object-fit:cover}" +
    ".jpp-tag{display:block;margin:12px 0 6px;color:" + accent + ";font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase}" +
    ".jpp-head h3{margin:0;color:#fff;font-size:22px;line-height:1.3;font-weight:800}" +
    ".jpp-body{padding:20px 26px 24px;color:#444;font-size:15px;line-height:1.55}" +
    ".jpp-body p{margin:0 0 14px}" +
    ".jpp-list{display:flex;flex-wrap:wrap;justify-content:center;gap:6px 14px;margin:0 0 18px;padding:0;list-style:none;font-size:13.5px;color:#222}" +
    ".jpp-list li:before{content:'\\2713';margin-right:5px;color:" + color + ";font-weight:700}" +
    "a.jpp-apply{display:block;padding:14px;border-radius:10px;background:" + accent + ";color:#0b2a44;font-size:17px;font-weight:800;text-decoration:none;transition:transform .15s ease,box-shadow .15s ease}" +
    "a.jpp-apply:hover{color:#0b2a44;text-decoration:none;transform:translateY(-2px);box-shadow:0 10px 20px rgba(0,0,0,.15)}" +
    ".jpp-login{display:inline-block;margin-top:12px;color:" + color + ";font-size:13.5px;font-weight:600}" +
    ".jpp-close{position:absolute;top:10px;right:10px;width:34px;height:34px;border:0;border-radius:50%;background:rgba(255,255,255,.18);color:#fff;font-size:22px;line-height:34px;cursor:pointer}" +
    ".jpp-close:hover{background:rgba(255,255,255,.32)}" +
    "@media (max-width:480px){.jpp-fab{left:12px;bottom:12px;padding:11px 15px;font-size:13px}.jpp-head h3{font-size:19px}}";

  function build() {
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    var overlay = document.createElement("div");
    overlay.className = "jpp-overlay";
    overlay.innerHTML =
      '<div class="jpp-modal" role="dialog" aria-modal="true" aria-labelledby="jpp-title">' +
        '<button type="button" class="jpp-close" aria-label="Close">&times;</button>' +
        '<div class="jpp-head">' +
          '<img src="' + PORTAL + '/static/images/logo.jpeg" alt="Imran Jobs">' +
          '<span class="jpp-tag"></span>' +
          '<h3 id="jpp-title"></h3>' +
        "</div>" +
        '<div class="jpp-body">' +
          '<p class="jpp-text"></p>' +
          '<ul class="jpp-list"><li>Free registration</li><li>Track your application</li><li>Govt. approved agency</li></ul>' +
          '<a class="jpp-apply" href="' + link("/signup/") + '" target="_blank" rel="noopener">Apply Now &rarr;</a>' +
          '<a class="jpp-login" href="' + link("/login/") + '" target="_blank" rel="noopener">Already registered? Login</a>' +
        "</div>" +
      "</div>";
    overlay.querySelector("#jpp-title").textContent = title;   // textContent: data-* text is never parsed as HTML
    overlay.querySelector(".jpp-text").textContent = text;
    overlay.querySelector(".jpp-tag").textContent = tag;
    document.body.appendChild(overlay);

    var fab = document.createElement("button");
    fab.type = "button";
    fab.className = "jpp-fab";
    fab.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 2h4a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4V4a2 2 0 0 1 2-2zm4 4V4h-4v2h4z"/></svg><span></span>';
    fab.querySelector("span").textContent = button;
    document.body.appendChild(fab);

    var lastFocus = null;
    function open() {
      lastFocus = document.activeElement;
      overlay.classList.add("jpp-open");
      overlay.querySelector(".jpp-apply").focus();
    }
    function close() {
      overlay.classList.remove("jpp-open");
      rememberClosed();
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    fab.addEventListener("click", open);
    overlay.querySelector(".jpp-close").addEventListener("click", close);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    overlay.querySelector(".jpp-apply").addEventListener("click", rememberClosed);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("jpp-open")) close();
    });

    // "?jobpopup" in the address forces the pop-up (handy for testing after it was closed)
    var forced = /[?&]jobpopup\b/.test(location.search);
    if (forced) forgetClosed();
    if (forced || !closedRecently()) setTimeout(open, DELAY_MS);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
