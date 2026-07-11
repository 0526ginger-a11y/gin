(function () {
  "use strict";

  const STORAGE_KEY = "portfolio-theme";
  const header = document.querySelector(".site-header");
  const navToggle = document.getElementById("nav-toggle");
  const themeToggle = document.getElementById("theme-toggle");
  const yearEl = document.getElementById("year");
  const searchForm = document.querySelector(".header-search");
  const searchInput = document.getElementById("site-search");

  const SEARCH_TARGETS = [
    { id: "about", keywords: ["關於", "about", "背景", "專業", "理念"] },
    { id: "projects", keywords: ["作品", "project", "專案", "官網", "儀表板"] },
    { id: "skills", keywords: ["技能", "skill", "html", "css", "javascript", "python", "git", "figma"] },
    { id: "experience", keywords: ["經歷", "experience", "競賽", "檢定", "黑客松"] },
    { id: "footer", keywords: ["聯絡", "contact", "email", "github", "linkedin"] },
  ];

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function setStoredTheme(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
  }

  function getPreferredTheme() {
    return "light";
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.setAttribute("data-theme", "light");
    }
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "light" ? "切換為深色主題" : "切換為淺色主題"
      );
    }
  }

  function initTheme() {
    const stored = getStoredTheme();
    const theme = stored === "light" || stored === "dark" ? stored : getPreferredTheme();
    applyTheme(theme);
  }

  function toggleTheme() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";
    applyTheme(next);
    setStoredTheme(next);
  }

  function closeNav() {
    if (!header || !navToggle) return;
    header.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "開啟選單");
  }

  function openNav() {
    if (!header || !navToggle) return;
    header.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "關閉選單");
  }

  function toggleNav() {
    if (!header || !navToggle) return;
    if (header.classList.contains("is-open")) {
      closeNav();
    } else {
      openNav();
    }
  }

  function initNavToggle() {
    if (!navToggle || !header) return;
    navToggle.addEventListener("click", toggleNav);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 768px)").matches) {
        closeNav();
      }
    });
  }

  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]:not(.skip-link)');
    links.forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        const id = anchor.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        closeNav();
        if (history.replaceState) {
          history.replaceState(null, "", id);
        }
      });
    });
  }

  function clearSearchHighlight() {
    document.querySelectorAll(".search-highlight").forEach(function (el) {
      el.classList.remove("search-highlight");
    });
  }

  function initSearch() {
    if (!searchForm || !searchInput) return;

    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const query = searchInput.value.trim().toLowerCase();
      clearSearchHighlight();

      if (!query) return;

      const match = SEARCH_TARGETS.find(function (target) {
        return target.keywords.some(function (keyword) {
          return keyword.includes(query) || query.includes(keyword);
        });
      });

      const section = document.getElementById(match ? match.id : "hero");
      if (!section) return;

      section.scrollIntoView({ behavior: "smooth", block: "start" });
      section.classList.add("search-highlight");
      closeNav();

      window.setTimeout(function () {
        section.classList.remove("search-highlight");
      }, 2000);
    });
  }

  function initReveal() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".reveal").forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    const elements = document.querySelectorAll(".reveal");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -6% 0px", threshold: 0.08 }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initYear() {
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    if (themeToggle) {
      themeToggle.addEventListener("click", toggleTheme);
    }
    initNavToggle();
    initSmoothScroll();
    initSearch();
    initReveal();
    initYear();
  });
})();
