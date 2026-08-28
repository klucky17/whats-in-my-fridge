import { Platform, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

import {useState} from 'react';

export default function Home(){
  const [ingredients, setIngredients] = useState<string[]>([])
  const [ingredientInput, setIngredientInput] = useState('')
  const [recipes, setRecipes] = useState([])

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

  const findRecipes = () => {
    
  }
}