/* 星火聚落 OPC · 共享交互脚本 */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 顶部导航：滚动状态（IntersectionObserver） ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var sentinel = document.createElement("div");
    sentinel.className = "scroll-sentinel";
    document.body.prepend(sentinel);
    var headerObserver = new IntersectionObserver(
      function (entries) {
        header.classList.toggle("scrolled", !entries[0].isIntersecting);
      },
      { threshold: 0 }
    );
    headerObserver.observe(sentinel);
  }

  /* ---------- 移动端菜单 ---------- */
  var burger = document.querySelector(".nav-burger");
  var mobileMenu = document.querySelector(".mobile-menu");
  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      var open = mobileMenu.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      var bars = burger.querySelectorAll("span");
      bars[0].style.transform = open ? "translateY(5px) rotate(45deg)" : "";
      bars[1].style.opacity = open ? "0" : "";
      bars[2].style.transform = open ? "translateY(-5px) rotate(-45deg)" : "";
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        burger.querySelectorAll("span").forEach(function (s) {
          s.style.transform = "";
          s.style.opacity = "";
        });
      });
    });
  }

  /* ---------- 滚动进场 ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) {
      el.classList.add("in");
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------- 首屏鼠标跟随光晕 ---------- */
  var hero = document.querySelector(".editorial-hero");
  if (hero && !reduced && window.matchMedia("(pointer: fine)").matches) {
    var raf = null;
    hero.addEventListener("pointermove", function (e) {
      if (raf) {
        return;
      }
      raf = requestAnimationFrame(function () {
        var rect = hero.getBoundingClientRect();
        hero.style.setProperty("--mx", e.clientX - rect.left + "px");
        hero.style.setProperty("--my", e.clientY - rect.top + "px");
        raf = null;
      });
    });
  }

  /* ---------- 数字滚动 ---------- */
  var counters = document.querySelectorAll("[data-count]");
  var numberCounters = Array.prototype.filter.call(counters, function (el) {
    return !el.closest("[data-carousel]");
  });
  if (reduced || !("IntersectionObserver" in window)) {
    numberCounters.forEach(function (el) {
      el.textContent = el.getAttribute("data-count");
    });
  } else {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }
          cio.unobserve(entry.target);
          var target = parseInt(entry.target.getAttribute("data-count"), 10) || 0;
          var suffix = entry.target.getAttribute("data-suffix") || "";
          var start = null;
          var dur = 1400;
          function step(ts) {
            if (!start) {
              start = ts;
            }
            var p = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            entry.target.textContent = Math.round(target * eased) + suffix;
            if (p < 1) {
              requestAnimationFrame(step);
            }
          }
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.4 }
    );
    numberCounters.forEach(function (el) {
      cio.observe(el);
    });
  }

  /* ---------- 通用自动轮播 / 滑块 ---------- */
  function initCarousel(root) {
    var slides = root.querySelectorAll(".stage-slide, .module-panel");
    if (!slides.length) {
      return;
    }
    var section = root.closest("section") || root;
    var track = root.querySelector("[data-track]");
    var dots = section.querySelectorAll(".stage-dots [data-dot], .stage-thumbs [data-dot], .module-dots [data-dot]");
    var countEl = section.querySelector(".stage-count, .slider-count");
    var progress = root.querySelector(".stage-progress i");
    var autoSeconds = parseFloat(root.getAttribute("data-auto") || "0");
    var total = slides.length;
    var index = 0;
    var timer = null;
    var paused = false;
    var hoverZone = root.closest(".hero-visual") || root;

    function pad(n) {
      return String(n).padStart(2, "0");
    }

    function restartProgress() {
      if (!progress) {
        return;
      }
      progress.classList.remove("is-running");
      progress.style.setProperty("--stage-duration", autoSeconds + "s");
      void progress.offsetWidth;
      if (!reduced && autoSeconds > 0 && !paused) {
        progress.classList.add("is-running");
      }
    }

    function render() {
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
        slide.setAttribute("aria-hidden", i === index ? "false" : "true");
      });
      if (track) {
        track.style.transform = "translateX(-" + index * 100 + "%)";
      }
      dots.forEach(function (dot) {
        dot.classList.toggle("is-active", parseInt(dot.getAttribute("data-dot"), 10) === index);
      });
      if (countEl) {
        countEl.textContent = pad(index + 1) + " / " + pad(total);
      }
      restartProgress();
    }

    function go(next) {
      index = (next + total) % total;
      render();
      resetTimer();
    }

    function resetTimer() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      if (!reduced && autoSeconds > 0 && !paused) {
        timer = setInterval(function () {
          go(index + 1);
        }, autoSeconds * 1000);
      }
    }

    section.querySelectorAll("[data-prev]").forEach(function (btn) {
      if (!root.contains(btn) && !section.contains(btn)) {
        return;
      }
      btn.addEventListener("click", function () {
        go(index - 1);
      });
    });
    section.querySelectorAll("[data-next]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        go(index + 1);
      });
    });
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        go(parseInt(dot.getAttribute("data-dot"), 10) || 0);
      });
    });

    hoverZone.addEventListener("mouseenter", function () {
      paused = true;
      resetTimer();
      if (progress) {
        progress.classList.remove("is-running");
      }
    });
    hoverZone.addEventListener("mouseleave", function () {
      paused = false;
      restartProgress();
      resetTimer();
    });
    hoverZone.addEventListener("focusin", function () {
      paused = true;
      resetTimer();
    });
    hoverZone.addEventListener("focusout", function () {
      paused = false;
      resetTimer();
    });

    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(index - 1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(index + 1);
      }
    });

    var startX = null;
    root.addEventListener("pointerdown", function (e) {
      startX = e.clientX;
    });
    root.addEventListener("pointerup", function (e) {
      if (startX === null) {
        return;
      }
      var delta = e.clientX - startX;
      startX = null;
      if (Math.abs(delta) > 42) {
        go(index + (delta < 0 ? 1 : -1));
      }
    });
    root.addEventListener("pointercancel", function () {
      startX = null;
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      } else {
        resetTimer();
      }
    });

    root.setAttribute("tabindex", "0");
    render();
    resetTimer();
  }

  document.querySelectorAll("[data-carousel]").forEach(initCarousel);

  /* ---------- 作品筛选 ---------- */
  var filterBar = document.querySelector(".filter-bar");
  if (filterBar) {
    var buttons = filterBar.querySelectorAll(".filter-btn");
    var items = document.querySelectorAll(".work-item");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) {
          b.classList.remove("on");
        });
        btn.classList.add("on");
        var key = btn.getAttribute("data-filter");
        items.forEach(function (item) {
          var match = key === "all" || item.getAttribute("data-cat") === key;
          item.classList.toggle("show", match);
        });
      });
    });
  }

  /* ---------- 联系表单 ---------- */
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = document.getElementById("form-msg");
      if (msg) {
        msg.classList.add("show");
        msg.textContent = "提交成功。当前为页面雏形，表单尚未接入后端，您的需求信息暂未发送。";
      }
      contactForm.reset();
    });
  }

  /* ---------- 页脚年份 ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
