import React from 'react'

const Search = ({searchTerm, setSeatchTerm}) => {
    return (
        <div className="search">
            <div>
                <img src="/search.svg" alt="search"/>
                <input type="text" placeholder="Search through thousands of movies" value={searchTerm}
                       onChange={(event) => setSeatchTerm(event.target.value)}/>
            </div>
        </div>
    )
}
export default Search
