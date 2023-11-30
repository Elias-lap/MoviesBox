import {useEffect  } from 'react'
import { useState } from "react";

const KEy = "7a700b8d";
export function useMovies(query ){
  
    const [isLoading, setisLoading] = useState(false);
    const [error, setError] = useState("");
    const [movies, setMovies] = useState([]);
    useEffect(() => {
        const controler = new AbortController()
        async function FeatchData() {
          try {
            
            setisLoading(true);
            setError("");
            const res = await fetch(
              `https://www.omdbapi.com/?apikey=${KEy}&s=${query}`,{signal : controler.signal}
            );
            if (!res.ok)
              throw new Error("Something went wrong with Fetching Movies");
            const data = await res.json();
            if (data.Response === "False") {
              throw new Error("Movie not found!");
            }
            setMovies(data.Search);
            setError('')
          } catch (error) {
            if(error.name !== 'AbortError'){
              setError(error.message);
            }
            
          } finally {
            setisLoading(false);
          }
        }
        if (query.length < 3) {
          setMovies([]);
          setError("");
          return;
        }
      
        FeatchData();
        
        return function(){
          controler.abort()
        }
      }, [query ]);
    return {isLoading ,error ,movies ,setisLoading}
}