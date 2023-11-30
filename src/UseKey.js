
import { useEffect } from "react";

export function Usekey( key, action ){
    useEffect(
        function () {
          function backescape(e) {
            if (e.code.toLowerCase() === key.toLowerCase()) {
                action();
            }
          }
    
          document.addEventListener("keydown", backescape);
          return function () {
            document.removeEventListener("keydown", backescape);
          };
        },
        [action , key]
      );
}