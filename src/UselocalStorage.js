import { useState } from "react";
import { useEffect } from "react"


export function useLocalStorage(  watched  , key){


    const [value , setValue] = useState(function(){
        const storegData = localStorage.getItem('key');
        return storegData? JSON.parse(storegData) :watched
       })




    useEffect(function(){
        localStorage.setItem('key' , JSON.stringify(value))
      },[value ,key])
 
      
 
return [value,setValue]
}