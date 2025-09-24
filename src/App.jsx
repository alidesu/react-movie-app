import React, {useState} from 'react'
import Search from "./components/search.jsx";

const App = () => {
    const [searchterm, setSearchterm] = useState('');

    return (
        <main>
            <div className="pattern"></div>
            <div className="wrapper">
                <header>
                    <img src="./hero-img.png" alt="Hero Banner"/>
                    <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
                </header>
                <Search searchTerm={searchterm} setSeatchTerm={setSearchterm}/>
            </div>
        </main>
    )
}
export default App
