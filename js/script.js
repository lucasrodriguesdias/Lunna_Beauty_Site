/* =========================
   Data
========================= */
const WHATSAPP_NUMBER = "5531998131303";

const services = {
  maquiagem: {
    title: "Maquiagem",
    description: "Uma produção criada a partir do seu estilo, da ocasião e das características que tornam sua beleza única. O acabamento é leve, elegante e pensado para acompanhar você com conforto e duração.",
    audience: "Festas, cerimônias e eventos"
  },
  ondas: {
    title: "Ondas",
    description: "Finalização com movimento, brilho e leveza para complementar a maquiagem e trazer um toque sofisticado ao visual, respeitando o caimento natural dos fios.",
    audience: "Eventos e produções completas"
  },
  chapinha: {
    title: "Chapinha",
    description: "Alinhamento cuidadoso para um cabelo polido, brilhante e com acabamento duradouro. Uma escolha clássica para compor produções elegantes e versáteis.",
    audience: "Ocasiões e finalizações clássicas"
  },
  curso: {
    title: "Curso de automaquiagem",
    description: "Um encontro prático para você conhecer melhor seus produtos, entender as necessidades da sua pele e aprender técnicas que façam sentido na sua rotina.",
    audience: "Quem deseja mais autonomia"
  }
};

const galleries = {
  formatura: {
    title: "Make para formatura",
    images: [
      { src: "assets/images/portfolio/formatura/01.webp", alt: "Maquiagem de formatura com vestido azul e ondas nos cabelos" },
      { src: "assets/images/portfolio/formatura/02.webp", alt: "Sorriso da cliente com maquiagem iluminada para formatura" }
    ]
  },
  noiva: {
    title: "Elegância clássica",
    images: [
      { src: "assets/images/portfolio/noiva/01.webp", alt: "Maquiagem clássica com pele iluminada e cabelo preso" },
      { src: "assets/images/portfolio/noiva/02.webp", alt: "Perfil de maquiagem sofisticada com acabamento natural" },
      { src: "assets/images/portfolio/noiva/03.webp", alt: "Close da maquiagem em tons neutros e acabamento elegante" }
    ]
  },
  glam: {
    title: "Make glam",
    images: [
      { src: "assets/images/portfolio/glam/01.webp", alt: "Make glam com delineado e cabelos lisos" },
      { src: "assets/images/portfolio/glam/02.webp", alt: "Produção glam com ondas largas e pele iluminada" }
    ]
  }
};

/* =========================
   Helpers
========================= */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getFocusable = (container) => [...container.querySelectorAll("a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex='-1'])")];
let lastFocusedElement = null;

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons({ "stroke-width": 1.7 });
}

function formatDate(dateValue) {
  if (!dateValue) return "A combinar";
  const [year, month, day] = dateValue.split("-");
  return `${day}/${month}/${year}`;
}

function openModal(modal) {
  lastFocusedElement = document.activeElement;
  modal.hidden = false;
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => modal.querySelector("[tabindex='-1']")?.focus());
}

function closeModal(modal) {
  modal.hidden = true;
  document.body.classList.remove("modal-open");
  lastFocusedElement?.focus();
}

function trapFocus(event, modal) {
  if (event.key !== "Tab") return;
  const focusable = getFocusable(modal);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

/* =========================
   Header and navigation
========================= */
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const backToTop = document.querySelector(".back-to-top");
const navLinks = [...document.querySelectorAll(".main-nav a")];

function setMenu(open) {
  mainNav.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  menuToggle.innerHTML = `<i data-lucide="${open ? "x" : "menu"}" aria-hidden="true"></i>`;
  refreshIcons();
}

menuToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  setMenu(!mainNav.classList.contains("open"));
});
navLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("click", (event) => {
  if (mainNav.classList.contains("open") && !mainNav.contains(event.target) && !menuToggle.contains(event.target)) setMenu(false);
});

function updateHeader() {
  const scrolled = window.scrollY > 24;
  header.classList.toggle("scrolled", scrolled);
  backToTop.classList.toggle("visible", window.scrollY > 620);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" }));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
  });
}, { rootMargin: "-35% 0px -55%", threshold: 0 });

document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

/* =========================
   Scroll reveals
========================= */
if (prefersReducedMotion) {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px" });
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
}

/* =========================
   Service modal
========================= */
const serviceModal = document.querySelector("#service-modal");
const serviceModalTitle = document.querySelector("#service-modal-title");
const serviceModalDescription = document.querySelector("#service-modal-description");
const serviceModalAudience = document.querySelector("#service-modal-audience");

function showService(serviceKey) {
  const service = services[serviceKey];
  if (!service) return;
  serviceModalTitle.textContent = service.title;
  serviceModalDescription.textContent = service.description;
  serviceModalAudience.textContent = service.audience;
  openModal(serviceModal);
}

document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("click", () => showService(card.dataset.service));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      showService(card.dataset.service);
    }
  });
});

serviceModal.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", () => closeModal(serviceModal)));

/* =========================
   Portfolio gallery
========================= */
const galleryModal = document.querySelector("#gallery-modal");
const galleryTitle = document.querySelector("#gallery-title");
const galleryMainImage = document.querySelector("#gallery-main-image");
const galleryCounter = document.querySelector("#gallery-counter");
const galleryThumbnails = document.querySelector("#gallery-thumbnails");
const galleryPrevious = document.querySelector(".gallery-prev");
const galleryNext = document.querySelector(".gallery-next");
const galleryStage = document.querySelector(".gallery-stage");
let activeGallery = null;
let activeImageIndex = 0;
let touchStartX = 0;

function renderGalleryImage() {
  if (!activeGallery) return;
  const image = activeGallery.images[activeImageIndex];
  galleryMainImage.src = image.src;
  galleryMainImage.alt = image.alt;
  galleryCounter.textContent = `${activeImageIndex + 1} / ${activeGallery.images.length}`;
  galleryPrevious.disabled = activeGallery.images.length < 2;
  galleryNext.disabled = activeGallery.images.length < 2;
  [...galleryThumbnails.children].forEach((thumbnail, index) => {
    thumbnail.classList.toggle("active", index === activeImageIndex);
    thumbnail.setAttribute("aria-current", index === activeImageIndex ? "true" : "false");
  });
}

function showGallery(galleryKey) {
  activeGallery = galleries[galleryKey];
  if (!activeGallery) return;
  activeImageIndex = 0;
  galleryTitle.textContent = activeGallery.title;
  galleryThumbnails.innerHTML = "";
  activeGallery.images.forEach((image, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", `Ver foto ${index + 1}`);
    const thumbnail = document.createElement("img");
    thumbnail.src = image.src;
    thumbnail.alt = "";
    button.append(thumbnail);
    button.addEventListener("click", () => {
      activeImageIndex = index;
      renderGalleryImage();
    });
    galleryThumbnails.append(button);
  });
  renderGalleryImage();
  openModal(galleryModal);
}

function changeGalleryImage(direction) {
  if (!activeGallery || activeGallery.images.length < 2) return;
  activeImageIndex = (activeImageIndex + direction + activeGallery.images.length) % activeGallery.images.length;
  renderGalleryImage();
}

document.querySelectorAll("[data-gallery]").forEach((button) => button.addEventListener("click", () => showGallery(button.dataset.gallery)));
galleryPrevious.addEventListener("click", () => changeGalleryImage(-1));
galleryNext.addEventListener("click", () => changeGalleryImage(1));
galleryModal.querySelectorAll("[data-close-gallery]").forEach((button) => button.addEventListener("click", () => closeModal(galleryModal)));
galleryStage.addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
galleryStage.addEventListener("touchend", (event) => {
  const distance = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(distance) > 48) changeGalleryImage(distance > 0 ? -1 : 1);
}, { passive: true });

document.addEventListener("keydown", (event) => {
  if (!galleryModal.hidden) {
    if (event.key === "Escape") closeModal(galleryModal);
    if (event.key === "ArrowLeft") changeGalleryImage(-1);
    if (event.key === "ArrowRight") changeGalleryImage(1);
    trapFocus(event, galleryModal);
    return;
  }
  if (!serviceModal.hidden) {
    if (event.key === "Escape") closeModal(serviceModal);
    trapFocus(event, serviceModal);
  }
});

/* =========================
   Testimonials carousel
========================= */
const testimonialTrack = document.querySelector("#testimonial-track");
const carouselDots = [...document.querySelectorAll(".carousel-dots button")];

carouselDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const card = testimonialTrack.children[Number(dot.dataset.slide)];
    card.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "nearest", inline: "center" });
  });
});

testimonialTrack.addEventListener("scroll", () => {
  const firstCard = testimonialTrack.firstElementChild;
  if (!firstCard) return;
  const index = Math.round(testimonialTrack.scrollLeft / (firstCard.offsetWidth + 14));
  carouselDots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === index));
}, { passive: true });

/* =========================
   WhatsApp form
========================= */
const whatsappForm = document.querySelector("#whatsapp-form");
const phoneField = document.querySelector("#phone");
const dateField = document.querySelector("#date");
const submitButton = whatsappForm.querySelector("button[type='submit']");
const allowedServices = new Set(["Maquiagem", "Ondas", "Chapinha", "Curso de automaquiagem", "Outro"]);
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
dateField.min = localToday;
let lastSubmissionAt = 0;

function cleanText(value, maxLength) {
  return String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

phoneField.addEventListener("input", () => {
  phoneField.setCustomValidity("");
  const digits = phoneField.value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) phoneField.value = digits;
  else if (digits.length <= 7) phoneField.value = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  else phoneField.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
});

whatsappForm.elements.name.addEventListener("input", () => whatsappForm.elements.name.setCustomValidity(""));
dateField.addEventListener("input", () => dateField.setCustomValidity(""));

whatsappForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!whatsappForm.reportValidity()) return;

  const data = new FormData(whatsappForm);
  if (cleanText(data.get("website"), 100)) return;

  const now = Date.now();
  if (now - lastSubmissionAt < 10000) return;

  const name = cleanText(data.get("name"), 80);
  const phone = cleanText(data.get("phone"), 15);
  const phoneDigits = phone.replace(/\D/g, "");
  const service = cleanText(data.get("service"), 40);
  const date = cleanText(data.get("date"), 10);
  const message = cleanText(data.get("message"), 500);

  if (name.length < 2 || !/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(name)) {
    whatsappForm.elements.name.setCustomValidity("Informe um nome válido.");
    whatsappForm.elements.name.reportValidity();
    return;
  }
  whatsappForm.elements.name.setCustomValidity("");

  if (!/^\d{10,11}$/.test(phoneDigits)) {
    phoneField.setCustomValidity("Informe um WhatsApp com DDD.");
    phoneField.reportValidity();
    return;
  }
  phoneField.setCustomValidity("");

  if (!allowedServices.has(service)) return;
  if (date && (date < localToday || !/^\d{4}-\d{2}-\d{2}$/.test(date))) {
    dateField.setCustomValidity("Escolha uma data válida, a partir de hoje.");
    dateField.reportValidity();
    return;
  }
  dateField.setCustomValidity("");

  lastSubmissionAt = now;
  submitButton.disabled = true;
  const lines = [
    "Olá, Lunna! Encontrei seu site e gostaria de solicitar um orçamento.",
    "",
    `Nome: ${name}`,
    `WhatsApp: ${phone}`,
    `Serviço: ${service}`,
    `Data: ${formatDate(date)}`
  ];
  if (message) lines.push("", "Mensagem:", message);

  const whatsappWindow = window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener,noreferrer");
  if (whatsappWindow) whatsappWindow.opener = null;
  window.setTimeout(() => { submitButton.disabled = false; }, 10000);
});

/* =========================
   Startup
========================= */
refreshIcons();
