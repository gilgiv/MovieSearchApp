// By title: https://www.omdbapi.com/?s=redemption&page=1&apikey=3c70b9a2
// details: https://www.omdbapi.com/?t=redemption&apikey=3c70b9a2

const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

// Load movies from API

function findMovies() {
    let searchTerm = (movieSearchBox.value).trim();
    if (searchTerm.length > 0) {
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

async function loadMovies(searchTerm) {
    const URL = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=3c70b9a2`;
    const res = await fetch(URL);
    const data = await res.json();

    if (data.Response === "True") displayMovieList(data.Search);
}


function displayMovieList(movies) {
    searchList.innerHTML = "";
    for (let idx = 0; idx < movies.length; idx++) {
        {
            const movie = movies[idx];
            let movieListItem = document.createElement("div");
            movieListItem.dataset.id = movie.Title;
            movieListItem.classList.add('search-list-item');
            if (movie.Poster != "N/A")
                moviePoster = movie.Poster;
            else
                moviePoster = "image_not_found.jpg"

            movieListItem.innerHTML = `
                        <div class="search-item-thumbnail">
                            <img src="${moviePoster}" alt="">
                        </div>
                        <div class="search-item-info">
                            <h3>${movie.Title}</h3>
                            <p>${movie.Year}</p>
                        </div>
            `;

            searchList.appendChild(movieListItem);

        };
        loadMovieDetails();
    }
}

function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`https://www.omdbapi.com/?t=${movie.dataset.id}&apikey=3c70b9a2`);
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails);
        });
    })

}

function displayMovieDetails(movieDetails) {
    resultGrid.innerHTML = `
                    <div class="movie-poster">
                        <img src="${(movieDetails.Poster != "N/A") ? movieDetails.Poster : "image_not_found.jpg"}" alt="movie poster">
                    </div>
                    <div class="movie-info">
                        <h3 class="movie-title">${movieDetails.Title}</h3>
                        <ul class="movie-misc-info">
                            <li class="year">year: ${movieDetails.Year}</li>
                            <li class="rated">IMDB Rating: ${movieDetails.imdbRating}</li>
                            <li class="released">Released: ${movieDetails.Released}</li>
                        </ul>
                        <p class="genre"><b>Genre:</b> ${movieDetails.Genre}</p>
                        <p class="writer"><b>Writer: </b>${movieDetails.Writer}</p>
                        <p class="actors"><b>Actors: </b>${movieDetails.Actors}</p>
                        <p class="plot"><b>Plot: </b>${movieDetails.Plot}</p>
                        <p class="language"><b>Language: </b> ${movieDetails.Language}</p>
                        <p class="awards"><b><i class="fas fa-award"></i></b> ${movieDetails.Awards}</p>
                        </ul>
                    </div>

                    `;
}

window.addEventListener('click', (event) => {
    if (event.target.className != "form-control") {
        searchList.classList.add('hide-search-list');
    }
})
