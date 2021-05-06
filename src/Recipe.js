import React from 'react';
import './App.css';

const Recipe = ({ title, calories, image, ingredients }) => {
    return (
        <div className="item_container">
            <h2 className="item_title">{title}</h2>
            <ol>
                {ingredients.map(ingredient => (
                    <li>{ingredient.text}</li>
                ))}
            </ol>
            <p className="item_cat">{calories}</p>
            <div className="img_container">
            <img src={image} alt="" className="item_img"/>
            </div>
        </div>
    );
}

export default Recipe;