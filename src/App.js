import React, { useState, useEffect }  from "react";
import Header from "./components/Header";
import RecipeExcerpt from './components/RecipeExcerpt';
import RecipeFull from "./components/RecipeFull";
import NewRecipeForm from "./components/NewRecipeForm";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    servings: 1, // conservative default
    description: "",
    image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" //default
  });
  const [showNewRecipeForm, setShowNewRecipeForm] = useState(false);

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

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  }

  const handleUnselectRecipe = () => {
    setSelectedRecipe(null);
  }

  const showRecipeForm = () => {
    setShowNewRecipeForm(true);
    setSelectedRecipe(null);
  }

  const hideRecipeForm = () => {
    setShowNewRecipeForm(false);
  }

  const onUpdateForm = (e) => {
    const { name, value } = e.target;
    setNewRecipe({ ...newRecipe, [name]: value });
  };

  return (
    <div className='recipe-app'>
      <Header showRecipeForm={showRecipeForm} />
      { selectedRecipe && <RecipeFull selectedRecipe={selectedRecipe} handleUnselectRecipe={handleUnselectRecipe} /> }
      { !selectedRecipe && (
        <div className="recipe-list">
          {recipes.map((recipe) => (
            <RecipeExcerpt key={recipe.id} recipe={recipe} handleSelectRecipe={handleSelectRecipe} />
          ))}
        </div>
      )}
      { showNewRecipeForm === true && <NewRecipeForm newRecipe={newRecipe} hideRecipeForm={hideRecipeForm} onUpdateForm={onUpdateForm} />}
    </div>
  );
}

export default App;
