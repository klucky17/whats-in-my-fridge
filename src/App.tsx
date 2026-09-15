import { useState } from 'react';
import './App.css';

export default function Home(){
  const [ingredients, setIngredients] = useState<string[]>([])
  const [ingredientInput, setIngredientInput] = useState('')
  const [loading, setLoading] = useState(false)

  //define ingredient -> what each ingredient contains
  interface Ingredient{
    id: number
    name: string
    amount: number
    unit: string
    image: string
  }

  //define recipe -> what the recipes from the api contains
  interface Recipe{
    id: number
    title: string
    image: string
    likes: number
    usedIngredients: Ingredient[]
    unusedIngredients: Ingredient[]
    missedIngredients: Ingredient[]
  }
  const [recipes, setRecipes] = useState<Recipe[]>([])  //an array of recipes

  const addIngredient = () => {
    const cleaned = ingredientInput.trim()  //clean out any white/trailing spaces
    if(cleaned && !ingredients.includes(cleaned)){
      setIngredients([...ingredients, cleaned])  //add to ingrdients if clean had not errors and is not already in ingreidnent list
    }
    setIngredientInput('')  //reset/clear input
  }

  const removeIngredient = (item: string) => {  //item has to be a string
    setIngredients(ingredients.filter((i) => i != item))  //filter/loop through all ingredients, drop when condition is false -> rice != rice
  }

  const findRecipes = async() => {
    if(ingredients.length === 0){  //no ingredients were entered
      return
    }

    setLoading(true)  //finding/loading recipes

    try{
      const response = await fetch(
        `http://localhost:3000/recipes?ingredients=${ingredients.join(',')}`
      )
      const data = await response.json()  //get the recipes data as a json
      const sortedData = [...data].sort((a, b) => b.likes - a.likes)  //sort by highest likes
      setRecipes(sortedData)  //get the recipes fetched with the inputed ingredients
    
    }catch(error){
      console.error("Failed to find recipes: ", error)  //display error
    
    }finally{
      setLoading(false)  //finished searching for recipes
    }
  }

  const getRecipeLink = (title: string, id: number) => {
    //slug = url friendly text string ie. apple peach strudal -> apple-peach-strudal
    //+ = if there is consecutive not a-z or 0-9 replace with only 1 '-'
    //g = global flag -> replace all in the link dont stop at only one
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')  //if character is not a-z or 0-9 replace with '-'
    return `https://spoonacular.com/recipes/${slug}-${id}`  //id = number assigned to each recipe
  }

  return(
    <div>
      <h1>What's in My Fridge?</h1>

      <input 
        className="ingredients-input"
        type = "text"
        placeholder = "Enter an Ingredient"
        value = {ingredientInput}
        onChange = {(e) => setIngredientInput(e.target.value)}  //everytime input value is changed, an event object e is received and the text lives in e.target.value
      />
      <button onClick={addIngredient}>Add</button>

      {ingredients.map((item) => (  //display each ingredient as a button for if the user wants to remove an ingredient later
        <button 
          onClick={() => removeIngredient(item)} 
          key={item}
        >
          {item}
        </button>  //clicking on the ingredient removes it
      ))}

      <button 
        onClick={findRecipes}
        disabled={loading || ingredients.length === 0}  //disable button if currently finding recipes or there are no ingredients
      >
        {loading ? "Searching..." : "Find Recipes"}  {/*if loading -> searching and button is disabled*/}
      </button>

      {/*display recipes*/}
      {recipes.map((recipe) => (
        <div key={recipe.id} className="recipe-card">
          <img src={recipe.image} className="recipe-img"></img>
          
          <div className="recipe-details">
            <h3>{recipe.title}</h3>
            
            <p>Uses:{" "}
              {recipe.usedIngredients.map((ingredient) => ingredient.name).join(", ")}
            </p>

            <p>Unused:{" "}
              {recipe.unusedIngredients.map((ingredient) => ingredient.name).join(", ")}
            </p>

            <p>Missing:{" "}
              {recipe.missedIngredients.map((ingredient) => ingredient.name).join(", ")}
            </p>

            <a className="recipe-link"
                    href={getRecipeLink(recipe.title, recipe.id)} 
                    target="_blank"  //open link in a new browser tab
                    rel="noopener noreferrer">  {/*make tab have no access to home page*/}
              View Full Recipe
            </a>

          </div>

        </div>
      ))}

    </div>
  )
}