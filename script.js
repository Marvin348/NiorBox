// Master arrays
let heroAnimes = [];
let popularAnimes = [];
let favoritesAnimes = [];
let topRatedAnimes = [];

document.addEventListener("DOMContentLoaded", async () => {
  await fetchHeroAnimes();
  await fetchPopularAnimes();
  await fetchFavoritesAnimes();
  await fetchTopRatedAnimes();
});

// HERO SECTION
async function fetchHeroAnimes() {
  const query = `
  query {
      Page(page: 1, perPage: 5) {
        media(type: ANIME, sort: POPULARITY_DESC) {
          id
          title {
            english
        }
          bannerImage
          description(asHtml: false)
          coverImage {
            large
        }
          description(asHtml: false)
          averageScore
          episodes
          duration  
          description(asHtml: false)
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
    heroAnimes = data.data.Page.media;
    console.log(heroAnimes);
    renderHero(heroAnimes);
    // initHeroSwiper();
    // heroAnimes.forEach((anime) => {
    //   console.log(anime.bannerImage);
    // });
  } catch (error) {
    console.error("Fehler beim Laden der Hero Section", error);
  }
}
function renderHero(data) {
  const heroContainer = document.querySelector(".hero__container");
  heroContainer.innerHTML = "";

  data.forEach(
    ({
      title,
      bannerImage,
      averageScore,
      description,
      duration,
      episodes,
      id,
    }) => {
      const heroItem = document.createElement("div");
      heroItem.classList.add("hero__item", "swiper-slide");

      // Hintergrund
      const heroBg = document.createElement("div");
      heroBg.classList.add("hero__bg");
      heroBg.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),url("${bannerImage}")`;

      // Spacing Container (liegt über dem Bild)
      const heroSpacingContainer = document.createElement("div");
      heroSpacingContainer.classList.add("hero-spacing__container");

      // Content-Wrapper
      const heroContent = document.createElement("div");
      heroContent.classList.add("hero__content");

      // Titel
      const heroTitle = document.createElement("h2");
      heroTitle.classList.add("hero__title");
      heroTitle.textContent = title.english;

      // Meta-Daten
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

      // Beschreibung
      const heroDescription = document.createElement("p");
      heroDescription.classList.add("hero__description");
      const shortDescription = description.slice(0, 100);
      heroDescription.textContent = `${shortDescription
          ? shortDescription.replace(/<\/?[^>]+(>|$)/g, "")
          : "No description"
      }.....`;

      // Buttons
      const heroButtons = document.createElement("div");
      heroButtons.classList.add("hero__buttons");

      const heroBtnWatch = document.createElement("a");
      heroBtnWatch.classList.add("hero__btn--watch", "hero__btn");
      heroBtnWatch.innerHTML = `Jetzt ansehen <i class="fa-solid fa-play"></i>`;

      const heroBtnDetails = document.createElement("a");
      heroBtnDetails.classList.add("hero__btn--details", "hero__btn");
      heroBtnDetails.innerHTML = `Details <i class="fa-solid fa-chevron-right"></i>`;

      heroBtnDetails.addEventListener("click", () => {
        fetchDetailsPanel(id);
        openDetailsPanel();
      });

      // Struktur zusammenbauen
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
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    // Navigation arrows
    // navigation: {
    //   nextEl: ".swiper-button-next",
    //   prevEl: ".swiper-button-prev",
    // },
  });
}

// POPULAR SECTION
async function fetchPopularAnimes() {
  const query = `
  query {
      Page(page: 1, perPage: 15) {
        media(type: ANIME, sort: POPULARITY_DESC) {
          coverImage {
            medium
            large
          }
          title {
            english
          }
        }
      }
    }`;

  try {
    const response = await fetch("https://graphql.anilist.co", {
      method: "Post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    popularAnimes = data.data.Page.media;
    // console.log(popularAnimes);
    renderPopular(popularAnimes);
    initPopularSwiper();
  } catch (error) {
    console.error("Fehler neim Laden der Popular Section", error);
  }
}
function renderPopular(data) {
  const popularContainer = document.querySelector(".popular__container");
  popularContainer.innerHTML = "";

  data.forEach(({ title, coverImage }) => {
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
  });
}

// FAVORITES SECTION
async function fetchFavoritesAnimes() {
  const query = `
  query {
      Page(page: 1, perPage: 15) {
        media(type: ANIME, sort: TRENDING_DESC) {
          coverImage {
            medium
            large
          }
          title {
            english
          }
        }
      }
    }`;

  try {
    const response = await fetch("https://graphql.anilist.co", {
      method: "Post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    favoritesAnimes = data.data.Page.media;
    // console.log(favoritesAnimes);
    renderFavorites(favoritesAnimes);
    initFavoritesSwiper();
  } catch (error) {
    console.error("Fehler beim Laden der Favorites Section", error);
  }
}
function renderFavorites(data) {
  const favoritesContainer = document.querySelector(".favorites__container");
  favoritesContainer.innerHTML = "";

  data.forEach(({ title, coverImage }) => {
    const favoritesItem = document.createElement("div");
    favoritesItem.classList.add("favorites__item", "swiper-slide");

    const favoritesImage = document.createElement("img");
    favoritesImage.classList.add("favorites__img", "anime-img");
    favoritesImage.src = coverImage.large;
    favoritesImage.alt = title.english;

    // Lazy Loading aktivieren
    favoritesImage.loading = "lazy";

    const favoritesTitle = document.createElement("span");
    favoritesTitle.classList.add("favorites__title", "anime-title");
    favoritesTitle.textContent = title.english;

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
  });
}

// TOP-RATED SECTION
async function fetchTopRatedAnimes() {
  const query = `
  query {
      Page(page: 1, perPage: 15) {
        media(type: ANIME, sort: SCORE_DESC) {
          coverImage {
            medium
            large
          }
          title {
            english
          }
        }
      }
    }`;
  try {
    const response = await fetch("https://graphql.anilist.co", {
      method: "Post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    topRatedAnimes = data.data.Page.media;
    // console.log(topRatedAnimes);
    renderTopRated(topRatedAnimes);
    initTopRatedSwiper();
  } catch (error) {
    console.error("Fehler beim Laden der TopRated Section", error);
  }
}
function renderTopRated(data) {
  const topRatedContainer = document.querySelector(".top-rated__container");
  topRatedContainer.innerHTML = "";

  data.forEach(({ title, coverImage }) => {
    const topRatedItem = document.createElement("div");
    topRatedItem.classList.add("top-rated__item", "swiper-slide");

    const topRatedImage = document.createElement("img");
    topRatedImage.classList.add("top-rated__img", "anime-img");
    topRatedImage.src = coverImage.large;
    topRatedImage.alt = title.english;

    // Lazy Loading aktivieren
    topRatedImage.loading = "lazy";

    const topRatedTitle = document.createElement("span");
    topRatedTitle.classList.add("top-rated__title", "anime-title");
    topRatedTitle.textContent = title.english;

    topRatedContainer.appendChild(topRatedItem);
    topRatedItem.append(topRatedImage, topRatedTitle);
  });
}
function initTopRatedSwiper() {
  const topRatedSwiper = new Swiper(".top-rated__slider", {
    direction: "horizontal",
    slidesPerView: 8,
    spaceBetween: 20,
    loop: false,
    watchSlidesVisibility: true,
  });
}

// DETAILS PANEL
async function fetchDetailsPanel(id) {
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
        }
      }`;

  try {
    const response = await fetch("https://graphql.anilist.co", {
      method: "Post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { id } }), // dein Query als String
    }); // dein Funktions-Parameter ID wird hier eingesetzt
    const data = await response.json();

    if (!data.data || !data.data.Media) {
      console.warn("⚠️ Kein Media für ID:", id, data);
      return; // 👉 brich ab statt Fehler
    }

    const anime = data.data.Media;

    console.log(data);
    renderDetailsPanel(anime);
  } catch (error) {
    console.error("Fehler beim Laden des DetailsPanel", error);
  }
}
function renderDetailsPanel(data) {
  const detailsContent = document.querySelector(".anime-details__content");
  detailsContent.innerHTML = `<button class="close-details">
            <i class="fa-solid fa-xmark"></i>
           </button>
          <div class="anime-details__main">
            <div class="anime-details__text">
              <h2 class="anime-details__heading">${data.title.english}</h2>
              <p class="anime-details__description">
                ${
                  data.description
                    ? data.description.replace(/<\/?[^>]+(>|$)/g, "")
                    : "No description"
                }
              </p>
              <div class="anime-details__info">
                <div class="anime-details__info-group">
                  <span class="anime-details__label"
                    >Status:<span
                      class="anime-details__value anime-details__status"
                    >
                      ${data.status}</span
                    ></span
                  >
                  <span class="anime-details__label"
                    >Season:<span
                      class="anime-details__value anime-details__info-season"
                    >
                      ${data.season}</span
                    ></span
                  >
                  <span class="anime-details__label"
                    >Episoden:<span
                      class="anime-details__value anime-details__episodes"
                    >
                      ${data.episodes}</span
                    ></span
                  >
                </div>
                <div class="anime-details__info-group">
                  <span class="anime-details__label"
                    >Studio:<span
                      class="anime-details__value anime-details__studio"
                    >
                      ${data.studios.nodes[0]?.name ?? "Unknown"}</span
                    ></span
                  >
                  <span class="anime-details__label"
                    >Type:<span
                      class="anime-details__value anime-details__type"
                    >
                      ${data.format}</span
                    ></span
                  >
                  <span class="anime-details__label"
                    >Zeit:<span
                      class="anime-details__value anime-details__duration"
                    >
                      ${data.duration}m</span
                    ></span
                  >
                </div>
              </div>
              <div class="anime-details__genre">
                <span>Genre:</span>
              </div>
            </div>
            <div class="anime-details__media">
              <img src="${
                data.coverImage.large
              }" alt="" class="anime-details__img" />
              <div>
                <span class="anime-details__rating">Rating ${
                  data.averageScore
                }</span>
                <div class="anime-details__stars">
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star"></i>
                  <i class="fa-solid fa-star-half-stroke"></i>
                </div>
              </div>
              <div class="anime-details__btns">
                <button class="anime-details__fav-btn fav-btn">
                  <i class="fa-solid fa-heart"></i> Favorites
                </button>
                <button class="anime-details__fav-btn trailer-btn">
                  <i class="fa-solid fa-video"></i> Trailer
                </button>
              </div>
            </div>
        </div>`;

  const genreListEl = document.querySelector(".anime-details__genre");

  data.genres.forEach((g) => {
    const btn = document.createElement("button");
    btn.className = "anime-details__genre-btn";
    btn.textContent = g;
    genreListEl.appendChild(btn);
  });
  const closeDetails = document.querySelector(".close-details");
  closeDetails.addEventListener("click", closeDetailsPanel);
}
//----------------------------------------------------------------------------------
// DETAILS PANEL
const animeDetails = document.querySelector(".anime-details");
function openDetailsPanel() {
  animeDetails.classList.add("open");
}
function closeDetailsPanel() {
  animeDetails.classList.remove("open");
}

//----------------------------------------------------------------------------------

// sidebar
const openSideBtn = document.querySelector(".nav__open-sidebar");
const sidebar = document.querySelector(".sidebar");

openSideBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});
//----------------------------------------------------------------------------------

// login
const login = document.querySelector(".login");
const closeLogin = document.getElementById("closeLogin");
closeLogin.addEventListener("click", () => {
  login.classList.remove("open");
});

const openLogin = document.querySelectorAll(".open__login");
openLogin.forEach((btn) => {
  btn.addEventListener("click", () => {
    login.classList.add("open");
  });
});
