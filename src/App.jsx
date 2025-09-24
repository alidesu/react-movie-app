import React, {useState, useEffect} from 'react'
import Search from "./components/search.jsx";
import Spinner from "./components/spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import {useDebounce} from 'react-use'
import {getTrendingMovies, updateSearchCount} from "./appwrite.js";


const API_BASE_URL = 'https://api.themoviedb.org/3/'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
    method: 'GET', headers: {
        'Accept': 'application/json', Authorization: `Bearer ${API_KEY}`
    }
}

const App = () => {
    const [searchterm, setSearchterm] = useState('');
    const [errormessage, setErrormessage] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
    const [trendingMovies, setTrendingMovies] = useState([]);


    useDebounce(() => setDebouncedSearchTerm(searchterm), 500, [searchterm]);

    const fetchMovies = async (query = '') => {
        setisLoading(true);
        setErrormessage('');
        try {
            const endpoint = query ?
                `${API_BASE_URL}search/movie?query=${encodeURIComponent(query)}` :
                `${API_BASE_URL}discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`

            const response = await fetch(endpoint, API_OPTIONS);
            const data = await response.json();
            setMovieList(data.results || []);

            // Only update search count for actual searches (not empty queries)
            if (query.trim() && data.results.length > 0) {
                await updateSearchCount(query, data.results[0]);
            }

        } catch (error) {
            console.error(`Error fetching movies: ${error}`)
            setErrormessage('Error fetching movies. Please try again later')
        } finally {
            setisLoading(false);
        }
    }

    const loadTrendingMovies = async () => {
        try {
            const movies = await getTrendingMovies();

            setTrendingMovies(movies);
        } catch (error) {
            console.error('Error fetching trending movies ${error}')

        }
    }

    useEffect(() => {
        fetchMovies(debouncedSearchTerm); // Use debouncedSearchTerm instead of searchterm
    }, [debouncedSearchTerm]);

    useEffect(() => {
        loadTrendingMovies();
    }, [])

    return (<main>
        <div className="pattern"></div>
        <div className="wrapper">
            <header>
                <img src="./hero-img.png" alt="Hero Banner"/>
                <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
                <Search searchTerm={searchterm} setSeatchTerm={setSearchterm}/>
            </header>

            {trendingMovies.length > 0 && (
                <section className='trending'>
                    <h2>Trending Movies</h2>
                    <ul>
                        {trendingMovies.map((movie, index) => (
                            <li key={movie.$id}>
                                <p>{index + 1}</p>
                                <img src={movie.poster_url} alt="movie.title"/>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <section className="all-movies">
                <h2 className='mt-[20px]'>All Movies</h2>
                {isLoading ? (
                    <Spinner/>
                ) : errormessage ? (
                    <p className='text-red-500'>{errormessage}</p>
                ) : (
                    <ul>
                        {movieList.map((movie) => (
                            <MovieCard key={movie.id} movie={movie}/>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    </main>)
}

export default App
