import { useState } from "react";

function Search() {
    const [query, setQuery] = useState('');

    const handleChange = (event) => {
        setQuery(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Llamar a la función de búsqueda pasando el término de búsqueda
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="What Would you like to do?"
                className="border-b border-black w-80 h-10 text-xl px-2 bg-white focus:outline-none"
            />
            {/* <button type="submit">Buscar</button> */}
        </form>
    );

}

export default Search;