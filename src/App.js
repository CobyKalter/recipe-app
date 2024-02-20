import React, { useState, useEffect }  from "react";
import Header from "./components/Header";
import RecipeExcerpt from './components/RecipeExcerpt';
import RecipeFull from "./components/RecipeFull";
import NewRecipeForm from "./components/NewRecipeForm";
import { displayToast } from "./helpers/toastHelper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const [searchTerm, setSearchTerm] = useState("");

 // Get all recipes from API 
  const fetchAllRecipes = async () => {
      try {
        const response = await fetch("/api/recipes");
        if (response.ok === false) {
          console.log("The response is not ok");
        } else {
          const data = await response.json();
          setRecipes(data);
        }
      } catch (e) {
        console.error("Something went wrong", e);
      }
  };

  useEffect(() => {
    fetchAllRecipes();
  }, []);

// Event handlers for selected recipe  
  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  }

  const handleUnselectRecipe = () => {
    setSelectedRecipe(null);
  }

// Event handlers for recipe form  
  const showRecipeForm = () => {
    setShowNewRecipeForm(true);
    setSelectedRecipe(null);
  }

  const hideRecipeForm = () => {
    setShowNewRecipeForm(false);
  }
  // Handler for any updates that occur while completing the form
  const onUpdateForm = (e, action = "new") => {
    const { name, value } = e.target;
    if (action === "update") {
      setSelectedRecipe({ ...selectedRecipe, [name]: value });
    } else if (action === "new") {
      setNewRecipe({ ...newRecipe, [name]: value });
    }
  };

// Adding a new recipe
  const handleNewRecipe = async (e, newFormRecipe) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newFormRecipe)
      });

      if (response.ok) {
        const data = await response.json();

        setRecipes([...recipes, data.recipe]);

        displayToast("Recipe added successfully", "success");

        setShowNewRecipeForm(false);
        setNewRecipe({
          title: "",
          ingredients: "",
          instructions: "",
          servings: 1,
          description: "",
          image_url: "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        })
      } else {
        displayToast("Oops - could not add recipe", "error");
      }
    } catch (e) {
        console.error("Something went wrong", e);
    }
  };

  // Updating a recipe
  const handleUpdateRecipe = async (e, selectedRecipe) => {
    e.preventDefault();

    const { id } = selectedRecipe;

    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(selectedRecipe)
      });

      if (response.ok) {
        const data = await response.json();

        setRecipes(recipes.map((recipe) => {
          if (recipe.id === id) {
            return data.recipe;
          } 
          return recipe;
          })
        );
        displayToast("Recipe updated successfully", "success");
      } else {
        displayToast("Oops - could not update recipe", "error");
      }
    } catch (e) {
        console.error("Something went wrong", e);
    }
    setSelectedRecipe(null);
  };

  // Deleting a recipe
  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await fetch(`/api/recipes/${selectedRecipe.id}`, {
      method: "DELETE",
    });

      if (response.ok) {
        setRecipes(recipes.filter((recipe) => recipe.id !== recipeId));
        setSelectedRecipe(null);

        displayToast("Recipe deleted successfully", "success");
        
        } else {
          displayToast("Recipe was unable to be deleted", "error");
        }
    
    } catch (e) {
      console.error("Something went wrong during the request", e);
    }
  };

  // Search functionality
  const updateSearchTerm = (text) => {
    setSearchTerm(text);
  }

  const handleSearch = () => {
    const searchResults = recipes.filter((recipe) => {
    const valuesToSearch = [
      recipe.title, recipe.ingredients, recipe.description 
    ];
    return valuesToSearch.some((searchValue) => searchValue.toLowerCase().includes(searchTerm.toLowerCase()));
    });
    return searchResults;
  };

  const displayedRecipes = searchTerm ? handleSearch() : recipes;

  const displayAllRecipes = () => {
    setSearchTerm("");
    setSelectedRecipe(null);
    setShowNewRecipeForm(false);
  }

  return (
    <div className='recipe-app'>
      <Header showRecipeForm={showRecipeForm} searchTerm={searchTerm} updateSearchTerm={updateSearchTerm} displayAllRecipes={displayAllRecipes}/>
      { showNewRecipeForm && (<NewRecipeForm newRecipe={newRecipe} hideRecipeForm={hideRecipeForm} onUpdateForm={onUpdateForm} handleNewRecipe={handleNewRecipe} />)}
      { selectedRecipe && <RecipeFull selectedRecipe={selectedRecipe} handleUnselectRecipe={handleUnselectRecipe} onUpdateForm={onUpdateForm} handleUpdateRecipe={handleUpdateRecipe} handleDeleteRecipe={handleDeleteRecipe}/> }
      { !selectedRecipe && !showNewRecipeForm && (
        <div className="recipe-list">
          {displayedRecipes.map((recipe) => (
            <RecipeExcerpt key={recipe.id} recipe={recipe} handleSelectRecipe={handleSelectRecipe} />
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
