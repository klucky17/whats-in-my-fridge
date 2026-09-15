require('dotenv').config()  //get the api key from the .env file
const express = require('express')  //import express -> a framework that lets us create a server
const cors = require('cors')  //allows expo app to make requests to the server

const app = express()  //create an 'app' object -> create the server app

app.use(cors())  //all requests from app uses cors -> enable cors for all requests

app.get('/recipes', async (req, res) => {  //a route to get requests to recipes, req=requests, res=response
    const {ingredients} = req.query  //get query from the website url
    
    if(!ingredients){  //no ingreidnets entered, throw an error as the response
        return res.status(400).json({error: 'Please enter at least 1 ingredient'})
    }

    //ingredients are entered
    try{
        //spoonacular api url
        //encodeURIComponent -> special charaters ie , . are safely formatted for a url
        //process.env.SPOONACULAR_API_KEY -> get the api key from .env
        const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=
                    ${encodeURIComponent(ingredients)}&number=20&apiKey=${process.env.SPOONACULAR_API_KEY}`  //find 20 recipes
        
        const response = await fetch(url)  //wait for res from api after requesting
        const data = await response.json()  //get the data as a json -> convert raw text to usable js object/array

        res.json(data)  //send data to expo app -> whatever called for the data, res/reponse = data
    
    } catch(error){
        res.status(500).json({error: 'Failed to get recipes'})
    }
})

//start the server after getting a response
    app.listen(3000, () => console.log('Server running on port 3000'))