// === ELEMENTOS DA INTERFACE ===
const searchButton = document.getElementById("search-button");
const overlay = document.getElementById("modal-overlay");
const movieNameInput = document.getElementById("movie-name");
const movieYearInput = document.getElementById("movie-year");
const movieListContainer = document.getElementById("movie-list");

// === ESTADO EM MEMÓRIA ===
let movieList = [];

// === SUA CHAVE DA API OMDb ===
const API_KEY = "d6d5845c";

// ------------------------------------------------------------------
// EVENTOS
// ------------------------------------------------------------------
searchButton.addEventListener("click", searchButtonClickHandler);

// ------------------------------------------------------------------
// FUNÇÕES PRINCIPAIS
// ------------------------------------------------------------------
async function searchButtonClickHandler() {
  try {
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&t=${formatMovieName()}${buildYearQuery()}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.Error) throw new Error("Filme não encontrado");

    // Supondo que você já tenha createModal definido em outro arquivo
    createModal(data);
    overlay.classList.add("open");
  } catch (error) {
    notie.alert({ type: "error", text: error.message });
  }
}

// ------------------------------------------------------------------
// FORMATADORES DE PARÂMETRO DA URL
// ------------------------------------------------------------------
function formatMovieName() {
  const name = movieNameInput.value.trim();
  if (!name) throw new Error("O nome do filme deve ser informado");
  return name.split(/\s+/).join("+");
}

function buildYearQuery() {
  const year = movieYearInput.value.trim();
  if (!year) return "";

  const isValidYear = year.length === 4 && !Number.isNaN(Number(year));
  if (!isValidYear) throw new Error("Ano do filme inválido.");

  return `&y=${year}`;
}

// ------------------------------------------------------------------
// LISTA DE FILMES (EM MEMÓRIA)
// ------------------------------------------------------------------
function addToList(movieObject) {
  if (isMovieAlreadyOnList(movieObject.imdbID)) return;
  movieList.push(movieObject);
  updateUI(movieObject);
}

function isMovieAlreadyOnList(id) {
  return movieList.some((movie) => movie.imdbID === id);
}

// ------------------------------------------------------------------
// UI
// ------------------------------------------------------------------
function updateUI({ imdbID, Poster, Title }) {
  const article = document.createElement("article");
  article.id = `movie-card-${imdbID}`;
  article.innerHTML = `
    <img src="${Poster}" alt="Poster de ${Title}.">
    <button class="remove-button">
      <i class="bi bi-trash"></i>Remover
    </button>
  `;

  article
    .querySelector(".remove-button")
    .addEventListener("click", () => removeFilmFromList(imdbID));

  movieListContainer.appendChild(article);
}

function removeFilmFromList(id) {
  notie.confirm({
    text: "Deseja remover o filme de sua lista?",
    submitText: "Sim",
    cancelText: "Não",
    position: "top",
    submitCallback() {
      movieList = movieList.filter((movie) => movie.imdbID !== id);
      document.getElementById(`movie-card-${id}`)?.remove();
    },
  });
}
