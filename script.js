/* ============================================================
   Portfolio interactions - beginner-friendly, vanilla JS
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- 1. Mobile navigation ---------- */
  const hamburger = document.getElementById("hamburger");
  const nav = document.querySelector(".nav");
  const navList = document.getElementById("navList");

  const closeMenu = () => {
    nav.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  };

  hamburger.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the menu when a link is clicked (mobile)
  navList.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  /* ---------- 2. Header shadow on scroll ---------- */
  const header = document.getElementById("header");

  /* ---------- 3. Active navigation highlighting ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const onScroll = () => {
    // Header style
    header.classList.toggle("scrolled", window.scrollY > 20);

    // Back to top visibility
    backToTop.classList.toggle("show", window.scrollY > 400);

    // Active link
    let currentId = "";
    const scrollPos = window.scrollY + 120;
    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });
    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${currentId}`
      );
    });
  };

  /* ---------- 4. Scroll reveal animations ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- 5. Project filtering ---------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      const filter = btn.dataset.filter;
      projectCards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("hide", !match);
      });
    });
  });

  /* ---------- 6 & 7. Contact form validation + messages ---------- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  const setError = (input, message) => {
    const errorEl = document.getElementById(`err-${input.id}`);
    input.classList.toggle("invalid", Boolean(message));
    if (errorEl) errorEl.textContent = message;
    return !message;
  };

  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    status.className = "form-status";

    const name = form.name;
    const email = form.email;
    const subject = form.subject;
    const message = form.message;

    let valid = true;
    valid = setError(name, name.value.trim() ? "" : "Please enter your name.") && valid;
    valid =
      setError(
        email,
        !email.value.trim()
          ? "Please enter your email."
          : !isEmail(email.value.trim())
          ? "Please enter a valid email address."
          : ""
      ) && valid;
    valid = setError(subject, subject.value.trim() ? "" : "Please enter a subject.") && valid;
    valid =
      setError(
        message,
        message.value.trim().length >= 10
          ? ""
          : "Message should be at least 10 characters."
      ) && valid;

    if (!valid) {
      status.textContent = "Please fix the highlighted fields.";
      status.classList.add("error-text");
      return;
    }

    /* ---------------------------------------------------------
       API-READY STRUCTURE
       ---------------------------------------------------------
       This form is frontend-only for now. To connect a backend
       later, replace the block below with a fetch() call, e.g.:

       try {
         const res = await fetch("/api/contact", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({
             name: name.value.trim(),
             email: email.value.trim(),
             subject: subject.value.trim(),
             message: message.value.trim(),
           }),
         });
         if (!res.ok) throw new Error("Request failed");
       } catch (err) {
         status.textContent = "Something went wrong. Please try again.";
         status.classList.add("error-text");
         return;
       }

       Never place secret API keys in this frontend file.
       --------------------------------------------------------- */

    // Simulated success (no backend connected yet)
    status.textContent =
      "Thanks! Your message has been captured locally. Connect an API to send it.";
    status.classList.add("success");
    form.reset();
  });

  // Clear a field's error as the user types
  form.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("input", () => setError(input, ""));
  });

  /* ---------- 8. Back to top button ---------- */
  const backToTop = document.getElementById("backToTop");
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- 9. Typing animation for hero roles ---------- */
  const typedEl = document.getElementById("typed");
  const roles = [
    "Web Developer",
    "DevOps Enthusiast",
    "CS Engineering Student",
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const typeLoop = () => {
    const current = roles[roleIndex];
    if (deleting) {
      charIndex--;
    } else {
      charIndex++;
    }
    typedEl.textContent = current.slice(0, charIndex);

    let delay = deleting ? 55 : 110;
    if (!deleting && charIndex === current.length) {
      delay = 1600; // pause at full word
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 300;
    }
    setTimeout(typeLoop, delay);
  };
  typeLoop();

  /* ---------- 10. Dynamic copyright year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Attach scroll listener ---------- */
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});
