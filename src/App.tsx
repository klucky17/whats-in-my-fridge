import { useState } from 'react';

export default function Home(){
  const [ingredients, setIngredients] = useState<string[]>([])
  const [ingredientInput, setIngredientInput] = useState('')
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)

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
}