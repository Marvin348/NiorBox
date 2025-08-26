/* ====== MASTER ARRAYS ===== */
let heroSection = [];
let popularSection = [];
let favoritesSection = [];
let topRatedSection = [];

/* ====== Loader ===== */
const loader = document.getElementById("loader");

document.addEventListener("DOMContentLoaded", fetchData);

/* ============================
   Fetch all sections in one GraphQL query
   Hero, Popular, Favorites, TopRated
============================ */
async function fetchData() {
  loader.style.display = "flex";
  const query = `
query {
  hero: Page(page: 1, perPage: 5) {
    media(type: ANIME, sort: POPULARITY_DESC) {
      id
      title {
        english
      }
      bannerImage
      coverImage {
        large
      }
      description(asHtml: false)
      averageScore
      episodes
      duration
      trailer {
        id
        site
      }
    }
  }
  popular: Page(page: 1, perPage: 15) {
    media(type: ANIME, sort: POPULARITY_DESC) {
      id
      title {
        english
      }
      coverImage {
        medium
        large
      }
      trailer {
        id
        site
      }
    }
  }
  favorites: Page(page: 1, perPage: 15) {
    media(type: ANIME, sort: FAVOURITES_DESC) {
      id
      title {
        english
      }
      coverImage {
        medium
        large
      }
      trailer {
        id
        site
      }
    }
  }
  topRated: Page(page: 1, perPage: 15) {
    media(type: ANIME, sort: SCORE_DESC) {
      id
      title {
        english
      }
      coverImage {
        medium
        large
      }
      trailer {
        id
        site
      }
    }
  }
}
`;
  try {
    const response = await fetch("https://graphql.anilist.co", {
      method: "Post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();

    const { hero, popular, favorites, topRated } = data.data;
    heroSection = hero.media;
    popularSection = popular.media;
    favoritesSection = favorites.media;
    topRatedSection = topRated.media;

    // HERO SECTION
    renderHero(heroSection);
    initHeroSwiper();

    // POPULAR SECTION
    renderPopular(popularSection);
    initPopularSwiper();

    // FAVORITES SECTION
    renderFavorites(favoritesSection);
    initSwiper(".favorites__slider");

    // TOP-RATED SECTION
    renderTopRated(topRatedSection);
    initSwiper(".top-rated__slider");
  } catch (error) {
    console.error("Fehler beim Laden:", error);
  } finally {
    loader.style.display = "none";
  }
}

/* ====== HERO SECTION ===== */
function renderHero(data) {
  const heroContainer = document.querySelector(".hero__container");
  heroContainer.innerHTML = "";

  data.forEach(
    ({
      title,
      bannerImage,
      coverImage,
      averageScore,
      description,
      duration,
      episodes,
      id,
      trailer,
    }) => {
      const heroItem = document.createElement("div");
      heroItem.classList.add("hero__item", "swiper-slide");

      const heroBg = document.createElement("div");
      heroBg.classList.add("hero__bg");

      setHeroBg(heroBg, coverImage, bannerImage);

      window.addEventListener("resize", () => {
        setHeroBg(heroBg, coverImage, bannerImage);
      });

      const heroSpacingContainer = document.createElement("div");
      heroSpacingContainer.classList.add("hero-spacing__container");

      const heroContent = document.createElement("div");
      heroContent.classList.add("hero__content");

      const heroTitle = document.createElement("h2");
      heroTitle.classList.add("hero__title");
      heroTitle.textContent = title.english;

      const heroMeta = document.createElement("div");
      heroMeta.classList.add("hero__meta");

      const heroRating = document.createElement("span");
      heroRating.classList.add("hero__rating");
      heroRating.innerHTML = `<i class="fa-solid fa-star"></i> ${averageScore}`;

      const heroDuration = document.createElement("span");
      heroDuration.classList.add("hero__duration");
      heroDuration.innerHTML = `<i class="fa-solid fa-clock"></i> ${duration}m`;

      const heroEpisodes = document.createElement("span");
      heroEpisodes.classList.add("hero__episodes");
      heroEpisodes.innerHTML = `<i class="fa-solid fa-film"></i> ${episodes}`;

      const heroDescription = document.createElement("p");
      heroDescription.classList.add("hero__description");
      const shortDescription = description.slice(0, 100);
      heroDescription.textContent = `${
        shortDescription
          ? shortDescription.replace(/<\/?[^>]+(>|$)/g, "")
          : "No description"
      }.....`;

      const heroButtons = document.createElement("div");
      heroButtons.classList.add("hero__buttons");

      const heroBtnWatch = document.createElement("a");
      heroBtnWatch.classList.add("hero__btn--watch", "hero__btn");
      heroBtnWatch.innerHTML = `Jetzt ansehen <i class="fa-solid fa-play"></i>`;

      const heroBtnDetails = document.createElement("a");
      heroBtnDetails.classList.add("hero__btn--details", "hero__btn");
      heroBtnDetails.innerHTML = `Details <i class="fa-solid fa-chevron-right"></i>`;

      heroBtnDetails.addEventListener("click", () => {
        lockScroll();
        fetchDetailsPanel(id);
        openDetailsPanel();
      });
      heroBtnWatch.addEventListener("click", () => {
        openTrailer(trailer.id, trailer.site);
      });

      heroContainer.appendChild(heroItem);
      heroItem.appendChild(heroBg);
      heroItem.appendChild(heroSpacingContainer);
      heroBg.append(heroSpacingContainer, heroContent);
      heroSpacingContainer.appendChild(heroContent);

      heroContent.append(heroTitle, heroMeta, heroButtons, heroDescription);
      heroMeta.append(heroRating, heroDuration, heroEpisodes);
      heroButtons.append(heroBtnWatch, heroBtnDetails);
    }
  );
}
function initHeroSwiper() {
  const heroSwiper = new Swiper(".hero__slider", {
    direction: "horizontal",
    loop: true,
    grabCursor: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
}
function setHeroBg(heroBg, coverImage, bannerImage) {
  const gradient = `
    linear-gradient(
      to top right,
      rgba(0,0,0,0.8) 0%,
      rgba(0,0,0,0.7) 25%,
      rgba(0,0,0,0.0) 85%
    )`;

  if (window.matchMedia("(max-width: 480px)").matches) {
    heroBg.style.backgroundImage = `${gradient}, url("${coverImage.large}")`;
  } else {
    heroBg.style.backgroundImage = `${gradient}, url("${bannerImage}")`;
  }
}

/* ====== POPULAR SECTION ===== */
function renderPopular(data) {
  const popularContainer = document.querySelector(".popular__container");
  popularContainer.innerHTML = "";

  data.forEach(({ title, coverImage, trailer }) => {
    const popularItem = document.createElement("div");
    popularItem.classList.add("popular__item", "swiper-slide");

    const popularImage = document.createElement("img");
    popularImage.classList.add("popular__img", "anime-img");
    popularImage.src = coverImage.large;
    popularImage.alt = title.english;

    // Lazy Loading aktivieren
    popularImage.loading = "lazy";

    const popularTitle = document.createElement("span");
    popularTitle.classList.add("popular__title", "anime-title");
    popularTitle.textContent = title.english;

    popularItem.addEventListener("click", () => {
      openTrailer(trailer.id, trailer.site);
    });

    popularContainer.appendChild(popularItem);

    popularItem.append(popularImage, popularTitle);
  });
}
function initPopularSwiper() {
  const popularSwiper = new Swiper(".popular__slider", {
    direction: "horizontal",
    slidesPerView: 8,
    spaceBetween: 20,
    loop: false,
    watchSlidesVisibility: true,
    grabCursor: true,
    breakpoints: {
      1440: {
        slidesPerView: 8,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 6,
        spaceBetween: 18,
      },
      640: {
        slidesPerView: 4,
        spaceBetween: 15,
      },
      480: {
        slidesPerView: 3,
        spaceBetween: 12,
      },
      320: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
    },
  });
}

/* ====== FAVORITES SECTION ===== */
function renderFavorites(data) {
  const favoritesContainer = document.querySelector(".favorites__container");
  favoritesContainer.innerHTML = "";

  data.forEach(({ title, coverImage, trailer }) => {
    const favoritesItem = document.createElement("div");
    favoritesItem.classList.add("favorites__item", "swiper-slide");

    const favoritesImage = document.createElement("img");
    favoritesImage.classList.add("favorites__img", "anime-img");
    favoritesImage.src = coverImage.large;
    favoritesImage.alt = title.english;
    favoritesImage.loading = "lazy";

    const favoritesTitle = document.createElement("span");
    favoritesTitle.classList.add("favorites__title", "anime-title");
    favoritesTitle.textContent = title.english;

    favoritesItem.addEventListener("click", () => {
      openTrailer(trailer.id, trailer.site);
    });

    favoritesContainer.appendChild(favoritesItem);
    favoritesItem.append(favoritesImage, favoritesTitle);
  });
}
function initFavoritesSwiper() {
  const favoritesSwiper = new Swiper(".favorites__slider", {
    direction: "horizontal",
    slidesPerView: 8,
    spaceBetween: 20,
    loop: false,
    watchSlidesVisibility: true,
    grabCursor: true,
    breakpoints: {
      1440: {
        slidesPerView: 8,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 6,
        spaceBetween: 18,
      },
      640: {
        slidesPerView: 6,
        spaceBetween: 15,
      },
      480: {
        slidesPerView: 4,
        spaceBetween: 12,
      },
      320: {
        // small Smartphones
        slidesPerView: 3,
        spaceBetween: 10,
      },
    },
  });
}

/* ====== TOPRATED SECTION ===== */
function renderTopRated(data) {
  const topRatedContainer = document.querySelector(".top-rated__container");
  topRatedContainer.innerHTML = "";

  data.forEach(({ title, coverImage, trailer }) => {
    const topRatedItem = document.createElement("div");
    topRatedItem.classList.add("top-rated__item", "swiper-slide");

    const topRatedImage = document.createElement("img");
    topRatedImage.classList.add("top-rated__img", "anime-img");
    topRatedImage.src = coverImage.large;
    topRatedImage.alt = title.english;
    topRatedImage.loading = "lazy";

    const topRatedTitle = document.createElement("span");
    topRatedTitle.classList.add("top-rated__title", "anime-title");
    topRatedTitle.textContent = title.english;

    topRatedItem.addEventListener("click", () => {
      openTrailer(trailer.id, trailer.site);
    });

    topRatedContainer.appendChild(topRatedItem);
    topRatedItem.append(topRatedImage, topRatedTitle);
  });
}

/* ====== DETAILS PANEL ===== */
async function fetchDetailsPanel(id) {
  loader.style.display = "flex";
  const query = `
  query ($id: Int) {
        Media(id: $id) {
          id
          coverImage {
            large
          }
          title {
            english
          }
          studios { nodes { name } }
          genres
          season
          seasonYear
          format
          duration
          status
          description
          averageScore
          episodes
          trailer {
          id
          site
          thumbnail
          }
        }
      }`;

  try {
    const response = await fetch("https://graphql.anilist.co", {
      method: "Post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { id } }),
    });
    const data = await response.json();

    if (data.errors) {
      console.error("GraphQL Fehler:", data.errors);
      return;
    }

    const details = data.data.Media;

    renderDetailsPanel(details);
  } catch (error) {
    console.error("Fehler beim Laden des DetailsPanel", error);
  } finally {
    loader.style.display = "none";
  }
}
function renderDetailsPanel(data) {
  const detailsContent = document.querySelector(".details-panel__content");
  detailsContent.innerHTML = `<button class="close-details">
            <i class="fa-solid fa-xmark"></i>
           </button>
          <div class="details-panel__main">
            <div class="details-panel__text">
              <h2 class="details-panel__heading">${data.title.english}</h2>
              <p class="details-panel__description">
                ${
                  data.description
                    ? data.description.replace(/<\/?[^>]+(>|$)/g, "")
                    : "No description"
                }
              </p>
              <div class="details-panel__info">
                <div class="details-panel__info-group">
                  <span class="details-panel__label"
                    >Status:<span
                      class="details-panel__value details-panel__status"
                    >
                      ${data.status}</span
                    ></span
                  >
                  <span class="details-panel__label"
                    >Season:<span
                      class="details-panel__value details-panel__info-season"
                    >
                      ${data.season}</span
                    ></span
                  >
                  <span class="details-panel__label"
                    >Episoden:<span
                      class="details-panel__value details-panel__episodes"
                    >
                      ${data.episodes}</span
                    ></span
                  >
                </div>
                <div class="details-panel__info-group">
                  <span class="details-panel__label"
                    >Studio:<span
                      class="details-panel__value details-panel__studio"
                    >
                      ${data.studios.nodes[0]?.name ?? "Unknown"}</span
                    ></span
                  >
                  <span class="details-panel__label"
                    >Type:<span
                      class="details-panel__value details-panel__type"
                    >
                      ${data.format}</span
                    ></span
                  >
                  <span class="details-panel__label"
                    >Zeit:<span
                      class="details-panel__value details-panel__duration"
                    >
                      ${data.duration}m</span
                    ></span
                  >
                </div>
              </div>
              <div class="details-panel__genre">
                <span>Genre:</span>
              </div>
            </div>
            <div class="details-panel__media">
              <img src="${
                data.coverImage.large
              }" alt="" class="details-panel__img" />
              <div>
                <span class="details-panel__rating">Rating ${
                  data.averageScore
                }</span>
                <div class="details-panel__stars">
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star-half-stroke"></i>
                </div>
              </div>
              <div class="details-panel__btns">
                <button class="details-panel__fav-btn fav-btn">
                  <i class="fa-solid fa-heart"></i> Favorites
                </button>
                <button class="details-panel__fav-btn trailer-btn">
                  <i class="fa-solid fa-video"></i> Trailer
                </button>
              </div>
            </div>
        </div>`;

  const genreListEl = document.querySelector(".details-panel__genre");

  data.genres.forEach((g) => {
    const btn = document.createElement("button");
    btn.className = "details-panel__genre-btn";
    btn.textContent = g;
    genreListEl.appendChild(btn);
  });
  const closeDetails = document.querySelector(".close-details");
  closeDetails.addEventListener("click", () => {
    closeDetailsPanel();
  });
}

/* ====== DETAILS PANEL OPEN/CLOSE ===== */
const animeDetails = document.querySelector(".details-panel");
function openDetailsPanel() {
  animeDetails.classList.add("open");
}
function closeDetailsPanel() {
  animeDetails.classList.remove("open");
  unlockScroll();
}
/* ====== SWIPER FUNCTION ===== */
function initSwiper(selector) {
  const topRatedSwiper = new Swiper(selector, {
    direction: "horizontal",
    slidesPerView: 8,
    spaceBetween: 20,
    loop: false,
    watchSlidesVisibility: true,
    grabCursor: true,
    breakpoints: {
      1440: {
        slidesPerView: 8,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 6,
        spaceBetween: 18,
      },
      640: {
        slidesPerView: 6,
        spaceBetween: 15,
      },
      480: {
        slidesPerView: 4,
        spaceBetween: 12,
      },
      320: {
        slidesPerView: 3,
        spaceBetween: 10,
      },
    },
  });
}

/* ====== SIDEBAR ===== */
const openSideBtn = document.querySelector(".nav__open-sidebar");
const sidebar = document.querySelector(".sidebar");

openSideBtn.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("open");

  openSideBtn.innerHTML = isOpen
    ? `<i class="fa-solid fa-xmark"></i>`
    : `<i class="fa-solid fa-bars-staggered"></i>`;
});

/* ====== TRAILER PANEL ===== */
const trailerPanel = document.querySelector(".trailer-panel");
const trailerCloseBtn = document.querySelector(".trailer-panel__close");

function renderTrailerPanel(trailerId, site) {
  const trailerContent = document.querySelector(".trailer-panel__content");
  trailerContent.innerHTML = "";

  const trailer = document.createElement("iframe");
  trailer.classList.add("trailer-panel__video");
  trailer.src = `https://www.${site}.com/embed/${trailerId}?autoplay=1&mute=1`;
  trailer.allow = "autoplay; fullscreen";

  trailerContent.append(trailer);
}

/* ====== TRAILER PANEL OPEN/CLOSE ===== */
function openTrailer(trailerId, site) {
  renderTrailerPanel(trailerId, site);
  trailerPanel.classList.add("open");
  lockScroll();
}

function closeTrailer() {
  trailerCloseBtn.addEventListener("click", () => {
    trailerPanel.classList.remove("open");
    unlockScroll();
  });
}

closeTrailer();

// Scroll Lock
function lockScroll() {
  document.body.classList.add("no-scroll");
}
function unlockScroll() {
  document.body.classList.remove("no-scroll");
}
