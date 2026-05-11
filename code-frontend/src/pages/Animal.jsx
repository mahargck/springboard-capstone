import { useState } from 'react'
import { NavLink } from "react-router-dom";

// import reactLogo from './assets/react.svg'
import beeLogo from '../images/sk-bee.png'
import chickenLogo from '../images/sk-chicken.png'
import duckLogo from '../images/sk-duck.png'
import quailLogo from '../images/sk-quail.png'
import turkeyLogo from '../images/sk-turkey.png'
import rabbitLogo from '../images/sk-rabbit.png'
import goatLogo from '../images/sk-goat.png'
import sheepLogo from '../images/sk-sheep.png'
import pigLogo from '../images/sk-pig.png'
import cowLogo from '../images/sk-cow.png'
// import './App.css'


export default function Animal() {
  const links= {
    "Insect": [
      { name: "Bee", logo: beeLogo, description: "Bees are a colony insect renound for their ability to collect nector and turn it into honey." }
    ],
    "Poultry": [
      { name: "Quail", logo: quailLogo, description: "Quails are small birds that are commonly raised for their meat and eggs." },
      { name: "Chicken", logo: chickenLogo, description: "Chickens are domesticated birds that are commonly raised for their meat and eggs." },
      { name: "Duck", logo: duckLogo, description: "Ducks are waterfowl that are commonly raised for their meat and eggs." },
      { name: "Geese", logo: null, description: "Geese are waterfowl that are commonly raised for their meat and eggs." },
      { name: "Turkey", logo: turkeyLogo, description: "Turkeys are large birds that are commonly raised for their meat." },
    ],
    "Small Livestock": [
      { name: "Rabbit", logo: rabbitLogo, description: "Rabbits are small mammals that are commonly raised for their meat and fur." }
    ],
    "Grasers": [
      { name: "Goat", logo: goatLogo, description: "Goats are domesticated animals that are commonly raised for their milk, meat, and hides." },
      { name: "Sheep", logo: sheepLogo, description: "Sheep are domesticated animals that are commonly raised for their wool, meat, and milk." },
      { name: "Pig", logo: pigLogo, description: "Pigs are domesticated animals that are commonly raised for their meat and hides." },
      { name: "Cow", logo: cowLogo, description: "Cows are domesticated animals that are commonly raised for their milk, meat, and hides." }
    ]
  }
  return (
    <>
      <h2>Animals</h2>
      <div className="w3-row">
        {Object.entries(links).map(([category, animals]) => (
          <div className="w3-col" key={category}>
            <h3>{category}</h3>
            {animals.map((animal) => (
              <div className="w3-col m6 l3" key={animal.name}>
                {(animal.logo || true) && (
                  <img src={animal.logo} alt={animal.name} className="w3-left logo" />
                )}
                <h3>
                  <NavLink className="hs-button" to={animal.name.toLowerCase()}>{animal.name}</NavLink>
                </h3>
                <p>{animal.description}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}