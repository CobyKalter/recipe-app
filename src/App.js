import React, { useState, useEffect }  from "react";
import Header from "./components/Header";
import RecipeExcerpt from './components/RecipeExcerpt';
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);

  const fetchAllRecipes = async () => {
      try {
        const request = await fetch("/api/recipes");
        const response = await request.json();
        if (response.ok === false) {
          console.log("The response is not ok");
        } else {
          setRecipes(response);
        }
      } catch (error) {
        console.log("Something went wrong", error);
      }
  }

  useEffect(() => {
    fetchAllRecipes();
  }, []);

  return (
    <div className='recipe-app'>
      <Header />
      <div className="recipe-list">
        { recipes.map((recipe) => (
          <RecipeExcerpt key={recipe.id} recipe={recipe}/>
          ))}
      </div>
      <p>Your recipes here! </p>
    </div>
  );
}

export default App;
