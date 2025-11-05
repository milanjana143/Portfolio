'use strict';

// element toggle function
const elementToggleFunc = (elem, cls = "active") => { elem.classList.toggle(cls); };

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
if (sidebarBtn && sidebar) {
  sidebarBtn.addEventListener("click", () => elementToggleFunc(sidebar));
}

// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function with aria
const testimonialsModalFunc = function (open = null) {
  if (!modalContainer || !overlay) return;
  // toggle if open is null; otherwise set according to boolean
  const isActive = open === null ? !modalContainer.classList.contains("active") : Boolean(open);
  modalContainer.classList.toggle("active", isActive);
  overlay.classList.toggle("active", isActive);
  modalContainer.setAttribute("aria-hidden", String(!isActive));
  if (isActive) {
    // focus management: move focus to close button if present
    modalCloseBtn?.focus();
  }
};

// add click event to all modal items (use forEach + guards)
testimonialsItem.forEach(item => {
  if (!item) return;
  item.addEventListener("click", function () {
    const avatar = this.querySelector("[data-testimonials-avatar]");
    const tTitle = this.querySelector("[data-testimonials-title]");
    const tText = this.querySelector("[data-testimonials-text]");

    if (avatar && modalImg) {
      modalImg.src = avatar.src || "";
      modalImg.alt = avatar.alt || "";
    }
    if (modalTitle && tTitle) modalTitle.textContent = tTitle.textContent;
    if (modalText && tText) modalText.textContent = tText.textContent;

    testimonialsModalFunc(true);

    // store which element opened the modal to restore focus later
    modalContainer._triggerElement = this;
  });

  // keyboard accessibility for testimonials (open on Enter/Space)
  item.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      item.click();
    }
  });
});

// add click event to modal close button and overlay
if (modalCloseBtn) modalCloseBtn.addEventListener("click", () => {
  testimonialsModalFunc(false);
  // restore focus if we saved it
  const trigger = modalContainer?._triggerElement;
  if (trigger) trigger.focus();
});

if (overlay) overlay.addEventListener("click", () => {
  testimonialsModalFunc(false);
  const trigger = modalContainer?._triggerElement;
  if (trigger) trigger.focus();
});

// close modal on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalContainer && modalContainer.classList.contains("active")) {
    testimonialsModalFunc(false);
    const trigger = modalContainer._triggerElement;
    if (trigger) trigger.focus();
  }
});


// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-select-value]"); // fixed typo
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });

  // open/close via keyboard
  select.addEventListener("keydown", (e) => {
    if (e.key === "Enter") elementToggleFunc(select);
    if (e.key === "Escape") select.classList.remove("active");
  });
}

// add event in all select items
selectItems.forEach(item => {
  item.addEventListener("click", function () {
    const selectedValue = this.textContent.trim().toLowerCase();
    if (selectValue) selectValue.textContent = this.textContent.trim();
    select && elementToggleFunc(select, "active");
    filterFunc(selectedValue);
  });

  // keyboard support for select items
  item.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      item.click();
    }
  });
});

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  if (!filterItems) return;
  const sel = (selectedValue || "").toLowerCase();
  filterItems.forEach(fi => {
    const cat = (fi.dataset.category || "").toLowerCase();
    if (sel === "all" || sel === cat) {
      fi.classList.add("active");
    } else {
      fi.classList.remove("active");
    }
  });
};

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn && filterBtn.length > 0 ? filterBtn[0] : null;

filterBtn.forEach(btn => {
  btn.addEventListener("click", function () {
    const selectedValue = this.textContent.trim().toLowerCase();
    if (selectValue) selectValue.textContent = this.textContent.trim();
    filterFunc(selectedValue);

    if (lastClickedBtn) lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });

  // keyboard support
  btn.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      btn.click();
    }
  });
});


// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
formInputs.forEach(input => {
  input.addEventListener("input", function () {
    if (!form || !formBtn) return;
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
});


// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
navigationLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    // prefer a data-target attribute for robustness; fallback to textContent
    const targetPage = (link.dataset.target || link.textContent || "").trim().toLowerCase();
    pages.forEach(page => {
      if ((page.dataset.page || "").toLowerCase() === targetPage) {
        page.classList.add("active");
      } else {
        page.classList.remove("active");
      }
    });

    navigationLinks.forEach(nav => nav.classList.remove("active"));
    link.classList.add("active");

    window.scrollTo(0, 0);
  });

  // keyboard support (Enter)
  link.addEventListener("keydown", e => {
    if (e.key === "Enter") link.click();
  });
});
