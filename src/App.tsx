import { useState } from 'react';

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
      setRecipes(data)  //get the recipes fetched with the inputed ingredients
    
    }catch(error){
      console.error("Failed to find recipes: ", error)  //display error
    
    }finally{
      setLoading(false)  //finished searching for recipes
    }
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
        <div key={recipe.id}>
          <img src={recipe.image}></img>
          <h3>{recipe.title}</h3>
          <p>Uses {recipe.usedIngredients}, Does not use {recipe.unusedIngredients}</p>
        </div>
      ))}

    </div>
  )
}