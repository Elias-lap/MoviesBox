import { useEffect, useRef } from "react";
import { useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./UseMovies";
import { useLocalStorage } from "./UselocalStorage";
import { Usekey } from "./UseKey";
const KEy = "7a700b8d";
export default function App() {
  const [query, setQuery] = useState("");
  const [watched, setWatched] = useLocalStorage([], "watched");
  const [SelectId, setSelectId] = useState(null);
  const { isLoading, error, movies, setisLoading } = useMovies(query);

  function OnselectId(OnselectId) {
    setSelectId((SelectId) => (SelectId === OnselectId ? null : OnselectId));
  }
  function HandelClosedDetailsMovies() {
    setSelectId(null);
  }
  function handelWatchedFilm(Filme) {
    setWatched((watched) => [...watched, Filme]);
  }
  function RemoveFilm(id) {
    let newWatched = watched.filter((movie) => movie.imdbID !== id);
    setWatched([...newWatched]);
  }

  return (
    <>
      <Navbar>
        <NavSearche query={query} setQuery={setQuery} />
        <NumResultes movies={movies} />
      </Navbar>

      <Main>
        <Movies>
          <ListOfMovies>
            {isLoading && <Loading />}
            {!isLoading && !error && (
              <DisplayMovie movies={movies} OnselectId={OnselectId} />
            )}
            {error && <HandelError message={error} />}
          </ListOfMovies>
        </Movies>
        <Movies>
          {SelectId ? (
            <MovieDetails
              HandelClosedDetailsMovies={HandelClosedDetailsMovies}
              SelectId={SelectId}
              isLoading={isLoading}
              setisLoading={setisLoading}
              handelWatchedFilm={handelWatchedFilm}
              watched={watched}
            />
          ) : (
            <>
              <ListMoviesWatchedSummary watched={watched} />

              <ListMoviesWatched watched={watched} RemoveFilm={RemoveFilm} />
            </>
          )}
        </Movies>
      </Main>
    </>
  );
}
function Loading() {
  return (
    <>
      <div className="loader">IsLoading... </div>{" "}
    </>
  );
}
function HandelError({ message }) {
  return <span className="error"> {message}</span>;
}
function Navbar({ children }) {
  return (
    <>
      <nav className="nav-bar">
        <Logo />
        {children}
      </nav>
    </>
  );
}

function Logo() {
  return (
    <>
      <div className="logo">
        <span role="img">🍿</span>
        <h1>Box Movies</h1>
      </div>
    </>
  );
}
function NavSearche({ query, setQuery }) {
  const Inputref = useRef(null);

  Usekey("Enter", function () {
    if (document.activeElement === Inputref.current) return;
    Inputref.current.focus();
    setQuery("");
  });
 
  return (
    <>
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={Inputref}
      />
    </>
  );
}
function NumResultes({ movies }) {
  return (
    <>
      <p className="num-results">
        Found <strong>{movies.length}</strong> results
      </p>
    </>
  );
}
function Main({ children }) {
  return (
    <>
      <main className="main">{children}</main>
    </>
  );
}
function Movies({ children }) {
  const [isOpen1, setIsOpen1] = useState(true);
  return (
    <>
      <div className="box">
        <button
          className="btn-toggle"
          onClick={() => setIsOpen1((open) => !open)}
        >
          {isOpen1 ? "–" : "+"}
        </button>
        {isOpen1 && children}
      </div>
    </>
  );
}
function ListOfMovies({ children }) {
  return (
    <>
      <ul className="list list-movies">{children}</ul>
    </>
  );
}
function DisplayMovie({ movies, OnselectId }) {
  return (
    <>
      {movies?.map((movie) => (
        <li onClick={() => OnselectId(movie.imdbID)} key={movie.imdbID}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
      ))}
    </>
  );
}
function ListMoviesWatchedSummary({ watched }) {
  const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating)).toFixed(2);
  const avgUserRating = average(watched.map((movie) => movie.userRating)).toFixed(2);
  const avgRuntime = average(watched.map((movie) => movie.runtime)).toFixed(0);
  return (
    <>
      <div className="summary">
        <h2>Movies you watched</h2>
        <div>
          <p>
            <span>#️⃣</span>
            <span>{watched.length} movies</span>
          </p>
          <p>
            <span>⭐️</span>
            <span>{avgImdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{avgUserRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{avgRuntime} min</span>
          </p>
        </div>
      </div>
    </>
  );
}
function MovieDetails({
  SelectId,
  HandelClosedDetailsMovies,
  handelWatchedFilm,
  watched,
}) {
  const [Movie, setMovie] = useState({});
  const [isLoading, setisLoading] = useState(false);
  const [UserRating, setUserRating] = useState(0);
  const isRated = watched.map((watched) => watched.imdbID).includes(SelectId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === SelectId
  )?.userRating;

  const mountRating = useRef(0);
  useEffect(
    function () {
      if (UserRating) mountRating.current += 1;
    },
    [UserRating]
  );

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = Movie;
  useEffect(() => {
    async function GetDetailsMovie() {
      setisLoading(true);
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${KEy}&i=${SelectId}`
      );
      const data = await res.json();
      console.log(data);
      setMovie(data);
      setisLoading(false);
    }
    GetDetailsMovie();
  }, [SelectId]);

  function Addfilm() {
    const film = {
      imdbID: SelectId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating: Number(UserRating),
      countRatingDecisions: mountRating.current,
    };

    handelWatchedFilm(film);
    HandelClosedDetailsMovies();
  }
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;
      return function () {
        document.title = `Box Movies`;
      };
    },
    [title]
  );
  Usekey("Escape", HandelClosedDetailsMovies);
  
  return (
    <>
      <div className="details">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <header>
              <button
                className=" btn btn-back"
                onClick={HandelClosedDetailsMovies}
              >
                &larr;
              </button>
              <img src={poster} alt={`poster of ${Movie} `} />
              <div className="details-overview">
                <h2>{title}</h2>
                <p>
                  {released} &bull; {runtime}
                </p>
                <p>{genre}</p>
                <p>
                  <span>⭐️</span>
                  {imdbRating} IMDb rating
                </p>
              </div>
            </header>

            <section>
              <div className="rating">
                {!isRated ? (
                  <>
                    {" "}
                    <StarRating
                      maxRating={10}
                      size="20"
                      onSetRated={setUserRating}
                    />
                    <button className="btn-add" onClick={Addfilm}>
                      Add Film To List
                    </button>{" "}
                  </>
                ) : (
                  <p>you rated with movie {watchedUserRating}👦 </p>
                )}
              </div>

              <p>
                <em>{plot}</em>
              </p>
              <p>Starring {actors}</p>
              <p>Directed by {director}</p>
            </section>
          </>
        )}
      </div>
    </>
  );
}
function ListMoviesWatched({ watched, RemoveFilm }) {
  return (
    <>
      <ul className="list">
        {watched.map((movie) => (
          <li key={movie.imdbID}>
            <img src={movie.poster} alt={`${movie.title} poster`} />
            <h3>{movie.title}</h3>
            <div>
              <p>
                <span>⭐️</span>
                <span>{movie.imdbRating.toFixed(2)}</span>
              </p>
              <p>
                <span>🌟</span>
                <span>{movie.userRating.toFixed(2)}</span>
              </p>
              <p>
                <span>⏳</span>
                <span>{movie.runtime} min</span>
              </p>
              <button
                className="btn-delete"
                onClick={() => RemoveFilm(movie.imdbID)}
              >
                X
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
