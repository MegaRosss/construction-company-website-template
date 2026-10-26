(function () {
    "use strict";

    var menuButton = document.querySelector(".menu-toggle");
    var navigation = document.querySelector("#primary-nav");
    var year = document.querySelector("[data-current-year]");

    if (year) {
        year.textContent = String(new Date().getFullYear());
    }

    if (menuButton && navigation) {
        menuButton.hidden = false;
        document.documentElement.classList.add("has-menu");

        menuButton.addEventListener("click", function () {
            var isExpanded = menuButton.getAttribute("aria-expanded") === "true";
            menuButton.setAttribute("aria-expanded", String(!isExpanded));
            navigation.classList.toggle("is-open", !isExpanded);
        });

        navigation.addEventListener("click", function (event) {
            if (event.target.closest("a") && window.matchMedia("(max-width: 700px)").matches) {
                menuButton.setAttribute("aria-expanded", "false");
                navigation.classList.remove("is-open");
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
                menuButton.setAttribute("aria-expanded", "false");
                navigation.classList.remove("is-open");
                menuButton.focus();
            }
        });
    }

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var workRail = document.querySelector(".work-rail");
    var workControls = document.querySelectorAll("[data-work-direction]");

    if (workRail) {
        workControls.forEach(function (button) {
            button.addEventListener("click", function () {
                var firstCard = workRail.querySelector(".work-card");
                var cardWidth = firstCard ? firstCard.getBoundingClientRect().width : workRail.clientWidth;
                var gap = parseFloat(window.getComputedStyle(workRail).columnGap) || 0;
                var direction = Number(button.getAttribute("data-work-direction"));

                workRail.scrollBy({
                    left: direction * (cardWidth + gap),
                    behavior: reduceMotion ? "auto" : "smooth"
                });
            });
        });
    }

    var gsap = window.gsap;
    var scrollTrigger = window.ScrollTrigger;
    var Lenis = window.Lenis;

    if (reduceMotion || !gsap || !scrollTrigger) {
        return;
    }

    gsap.registerPlugin(scrollTrigger);
    document.documentElement.classList.add("motion-ready");

    gsap.timeline({ defaults: { ease: "power3.out" } })
        .to(".hero-copy > *", {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.09
        })
        .to(".hero-visual", {
            autoAlpha: 1,
            y: 0,
            duration: 0.9
        }, "-=0.6");

    gsap.utils.toArray("[data-reveal]").forEach(function (element) {
        gsap.to(element, {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            ease: "power2.out",
            scrollTrigger: {
                trigger: element,
                start: "top 88%",
                once: true
            }
        });
    });

    if (Lenis) {
        var lenis = new Lenis({ duration: 1.05, smoothWheel: true });

        lenis.on("scroll", scrollTrigger.update);
        gsap.ticker.add(function (time) {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }
}());
