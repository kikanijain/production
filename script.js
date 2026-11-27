
/* =========================================================
   BIZVOICE — HOMEPAGE INTERACTIONS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const primaryNav = document.querySelector(".primary-nav");
    const dropdown = document.querySelector(".nav-dropdown");
    const dropdownTrigger = document.querySelector(".dropdown-trigger");
    const navLinks = document.querySelectorAll(".primary-nav a");
    const currentYear = document.getElementById("current-year");

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /* -------------------------
       AUTOMATIC COPYRIGHT YEAR
    -------------------------- */

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    /* -------------------------
       MOBILE NAVIGATION
    -------------------------- */

    function closeMobileMenu() {
        if (!menuToggle || !primaryNav) return;

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");

        primaryNav.classList.remove("is-open");
        document.body.classList.remove("menu-open");
    }

    function openMobileMenu() {
        if (!menuToggle || !primaryNav) return;

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation");

        primaryNav.classList.add("is-open");
        document.body.classList.add("menu-open");
    }

    if (menuToggle && primaryNav) {
        menuToggle.addEventListener("click", () => {
            const isExpanded =
                menuToggle.getAttribute("aria-expanded") === "true";

            if (isExpanded) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) {
                closeMobileMenu();
            }
        });

        // Close the drawer when clicking outside it.
    document.addEventListener("click", (event) => {
         const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

            if (
                 isOpen &&
                !primaryNav.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMobileMenu();
            }
        });
    }

    /* -------------------------
       COMPANY DROPDOWN
    -------------------------- */

    function closeDropdown() {
        if (!dropdown || !dropdownTrigger) return;

        dropdown.classList.remove("is-open");
        dropdownTrigger.setAttribute("aria-expanded", "false");
    }

    if (dropdown && dropdownTrigger) {
        dropdownTrigger.addEventListener("click", (event) => {
            event.stopPropagation();

            const isOpen = dropdown.classList.contains("is-open");

            dropdown.classList.toggle("is-open", !isOpen);

            dropdownTrigger.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );
        });

        document.addEventListener("click", (event) => {
            if (!dropdown.contains(event.target)) {
                closeDropdown();
            }
        });
    }

    /* -------------------------
       ESCAPE KEY SUPPORT
    -------------------------- */

    document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  const menuWasOpen =
    menuToggle?.getAttribute("aria-expanded") === "true";

  closeMobileMenu();
  closeDropdown();

  if (menuWasOpen) {
    menuToggle.focus();
  }
        });
    /* -------------------------
       SCROLL REVEAL
    -------------------------- */

    const revealElements = document.querySelectorAll(".reveal");

    if (
        reducedMotion ||
        !("IntersectionObserver" in window)
    ) {
        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });
    } else {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    }

    /* -------------------------
       ACTIVE NAVIGATION STATE
    -------------------------- */

    const sections = document.querySelectorAll(
        "main section[id]"
    );

    const mainNavLinks = document.querySelectorAll(
        '.primary-nav > a[href^="#"]'
    );

    function setHomeActive() {
        const homeLink = document.querySelector(
            '.primary-nav a[href="#top"]'
        );

        if (!homeLink) return;

        mainNavLinks.forEach((link) => {
            link.classList.remove("active");
        });

        homeLink.classList.add("active");
    }

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const sectionId = entry.target.id;

                    const matchingLink = document.querySelector(
                        `.primary-nav > a[href="#${sectionId}"]`
                    );

                    if (!matchingLink) return;

                    mainNavLinks.forEach((link) => {
                        link.classList.remove("active");
                    });

                    matchingLink.classList.add("active");
                });
            },
            {
                rootMargin: "-35% 0px -55% 0px",
                threshold: 0
            }
        );

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }

    /* -------------------------
       RELIABLE PAGE TOP NAVIGATION
    -------------------------- */

    function scrollToPageTop() {
        window.scrollTo({
            top: 0,
            behavior: reducedMotion ? "auto" : "smooth"
        });

        // Remove the URL fragment after returning Home.
        if (window.location.hash) {
            history.replaceState(
                null,
                "",
                window.location.pathname + window.location.search
            );
        }

        setHomeActive();
    }

    /* -------------------------
       RELIABLE SECTION NAVIGATION
    -------------------------- */

    function scrollToSection(target) {
        const header = document.querySelector(".site-header");

        const headerHeight = header
            ? header.getBoundingClientRect().height
            : 0;

        const targetPosition =
            target.getBoundingClientRect().top + window.scrollY;

        const destination = Math.max(
            0,
            targetPosition - headerHeight - 12
        );

        window.scrollTo({
            top: destination,
            behavior: reducedMotion ? "auto" : "smooth"
        });
    }

    /* -------------------------
       HANDLE ALL INTERNAL LINKS
    -------------------------- */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            event.preventDefault();

            closeMobileMenu();
            closeDropdown();

            // Home, logo and Back to top.
            if (targetId === "#top") {
                scrollToPageTop();
                return;
            }

            // Find the requested section.
            const target = document.getElementById(
                targetId.substring(1)
            );

            if (!target) return;

            scrollToSection(target);

            // Update the URL without jumping to the anchor.
            history.replaceState(
                null,
                "",
                targetId
            );
        });
    });

    /* -------------------------
       KEEP HOME ACTIVE AT TOP
    -------------------------- */

    window.addEventListener(
        "scroll",
        () => {
            if (window.scrollY <= 80) {
                setHomeActive();
            }
        },
        { passive: true }
    );

    /* -------------------------
       FAQ
       Native <details> handles
       open and close interaction.
    -------------------------- */

    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
        const summary = item.querySelector("summary");

        if (!summary) return;

        summary.addEventListener("keydown", (event) => {
            if (
                event.key === "Enter" ||
                event.key === " "
            ) {
                event.preventDefault();
                item.open = !item.open;
            }
        });
    });
});
