
import ReactDOM from 'react-dom/client';
 import './index.css';
 import App from './App';
// import StarRating from './StarRating.jsx'

// function Test(){
//   const[rated , setRated] = useState(0)
  
//   return(
//   <>
//    <div>
//     <StarRating   color='blue'  maxRating={10}  onSetRated={setRated} defultRating = {4} />
//     <p>This movie was rated {rated}  times</p>
//   </div>
//   </>)
 
// }
// function Test1(){
//   const[rated , setRated] = useState(0)
//   return(
//     <>
//         <div>
//         <StarRating   maxRating={5} color={'red'}  defultRating = {3} onSetRated={setRated} />
//         <p>This movie was rated {rated}  times</p>
//         </div>

//     </>
//   )
// }
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<>
     <App/> 
    
    
    {/* <Test/>
    <Test1/> */}
    </>
  );


