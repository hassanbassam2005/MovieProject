import { createContext,useState,useEffect,useContext } from "react";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider= ({children}) => {
    const [favorites,setFavorite] = useState([]);
    useEffect(()=>{
        const storedFavs = localStorage.getItem("favorites");
        if(storedFavs) setFavorite(JSON.parse(storedFavs))
    },[])

    useEffect(()=>{
        localStorage.setItem('favorites', JSON.stringify(favorites))
    },[favorites])

    const addTofavorite = (movie) =>{
        setFavorite(prev=>[...prev,movie])
    }

    const removeFromFavorites = (movieId)=>{
        setFavorite(prev => prev.filter(movie => movie.id !== movieId))
    }

    const isFavorite = (movieId) =>{
        return favorites.some(movie => movie.id === movieId);
    }

    const value = {
        favorites,
        addTofavorite,
        removeFromFavorites,
        isFavorite
    }

    return <MovieContext.Provider value ={value}>
        {children}
    </MovieContext.Provider>
};
