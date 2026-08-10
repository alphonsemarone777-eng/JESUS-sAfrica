const book = document.querySelector(".book");
const pages = Array.from(document.querySelectorAll(".page"));
const pageNumber = document.querySelector(".page-number");
const prevButton = document.querySelector(".nav-btn.prev");
const nextButton = document.querySelector(".nav-btn.next");

let currentPage = 0;
let startX = 0;

function updatePageNumber() {
  if (pageNumber) {
    pageNumber.textContent = `${currentPage + 1} / ${pages.length}`;
  }
}

function showPage(index) {
  if (!pages.length) return;

  if (index < 0) index = 0;
  if (index >= pages.length) index = pages.length - 1;

  currentPage = index;

  pages.forEach((page, i) => {
    const isActive = i === index;
    page.classList.toggle("active", isActive);
    page.style.display = isActive ? "block" : "none";
    if (isActive) {
      page.scrollTop = 0;
    }
  });

  book.classList.toggle("opened", index > 0);
  updatePageNumber();
}

function openBook() {
  if (currentPage === 0) {
    showPage(1);
  }
}

function closeBook() {
  if (currentPage === 1) {
    showPage(0);
  }
}

function nextPage() {
  if (currentPage === 0) {
    openBook();
    return;
  }

  if (currentPage < pages.length - 1) {
    showPage(currentPage + 1);
  }
}

function prevPage() {
  if (currentPage === 1) {
    closeBook();
    return;
  }

  if (currentPage > 0) {
    showPage(currentPage - 1);
  }
}

book.addEventListener("click", (event) => {
  if (event.target.closest("button")) {
    event.stopPropagation();
    return;
  }

  const rect = book.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const isRightSide = x > rect.width / 2;

  if (currentPage === 0) {
    openBook();
    return;
  }

  if (currentPage === 1 && !isRightSide) {
    closeBook();
    return;
  }

  if (isRightSide) {
    nextPage();
  } else {
    prevPage();
  }
});

prevButton?.addEventListener("click", (event) => {
  event.stopPropagation();
  prevPage();
});

nextButton?.addEventListener("click", (event) => {
  event.stopPropagation();
  nextPage();
});

book.addEventListener(
  "touchstart",
  (event) => {
    startX = event.touches[0].clientX;
  },
  { passive: true },
);

book.addEventListener(
  "touchend",
  (event) => {
    const delta = event.changedTouches[0].clientX - startX;

    if (delta < -50) {
      nextPage();
    } else if (delta > 50) {
      prevPage();
    }
  },
  { passive: true },
);

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "PageDown") {
    nextPage();
  }

  if (event.key === "ArrowLeft" || event.key === "PageUp") {
    prevPage();
  }
});

document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("error", () => {
    const placeholder = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360"><rect width="100%" height="100%" fill="#f7e8bc"/><rect x="20" y="20" width="560" height="320" rx="18" fill="none" stroke="#c29b2b" stroke-width="4"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="#8b6508">Illustration à venir</text></svg>')}`;
    img.src = placeholder;
  });
});

showPage(0);
