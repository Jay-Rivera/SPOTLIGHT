const apiKey = `67129a98`;
const movieListEl = document.querySelector(".search__results--items");
const nextPageBtn = document.getElementById("next__page");
let currentPage = 1;
let currentSearchTerm = "";

async function getMovieData(page = 1) {
  const value = document.getElementById("search__value").value;
  if (value !== currentSearchTerm) {
    currentSearchTerm = value;
    currentPage = 1;
  }

  try {
    const response = await fetch(
      `http://www.omdbapi.com/?apikey=${apiKey}&s=${currentSearchTerm}&page=${page}`
    );
    const moviesData = await response.json();

    if (moviesData.Response === "True") {
      const movieHTML = await Promise.all(
        moviesData.Search.map(async (movie) => {
          const movieDetailResponse = await fetch(
            `http://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`
          );
          const movieDetail = await movieDetailResponse.json();

          return `
          <div class="search__results--item">
            <figure>
              <h1 class="ticket__title">${movie.Title}</h1>
              <img
                class="ticket__image"
                src="${
                  movie.Poster !== "N/A"
                    ? movie.Poster
                    : "https://via.placeholder.com/150"
                }"
                alt="${movie.Title} Poster"
              />
            </figure>
            <h2 class="ticket__para--year">Year : ${movie.Year}</h2>
            <h3 class="ticket__para">${movieDetail.Plot}</h3>
            <h3 class="ticket__para--actors">Actors: ${movieDetail.Actors}</h3>
          </div>
        `;
        })
      );

      movieListEl.innerHTML = movieHTML.join("");

      if (moviesData.totalResults > page * 10) {
        nextPageBtn.style.display = "block";
      } else {
        nextPageBtn.style.display = "none";
      }
    } else {
      movieListEl.innerHTML = `<p class="error__message">No results found for "${currentSearchTerm}". Please try another search term.</p>`;
      nextPageBtn.style.display = "none";
    }
  } catch (error) {
    console.error("Error fetching movie data:", error);
    movieListEl.innerHTML = `<p class="error__message">There was an error fetching the movie data. Please try again later.</p>`;
    nextPageBtn.style.display = "none";
  }
}

nextPageBtn.addEventListener("click", () => {
  currentPage += 1;
  getMovieData(currentPage);
  $(document).scrollTop(0);
});

document
  .getElementById("search__value")
  .addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      getMovieData();
    }
  });
