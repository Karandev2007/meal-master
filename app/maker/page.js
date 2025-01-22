"use client";

import { useState } from "react";

export default function Home() {
  const [ingredients, setIngredients] = useState([""]);
  const [dish, setDish] = useState(null);
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [loadingSurprise, setLoadingSurprise] = useState(false);
  const [error, setError] = useState(null); // show error msg
  const [showNutriInfo, setShowNutriInfo] = useState(false);
  const [dietaryPrefer, setdietaryPrefer] = useState("vegetarian"); // set default vegi

  // add new ingredient box
  const addIngredientBox = () => {
    setIngredients([...ingredients, ""]);
  };

  // remove ingredient box
  const removeIngredientBox = (index) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };

  const updateIngredient = (index, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = value;
    setIngredients(updatedIngredients);
  };

  // ai reponse formatter
  const formatDishText = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
  };

  // function to play audios for gen & supr
  const playAudio4generate = () => {
    const audio = new Audio("/success.mp3");
    audio.play();
  };

  const playAudio4suprise = () => {
    const audio = new Audio("/wow.mp3");
    audio.play();
  };

  // generate dish and process
  const generateDishes = async () => {
    const query = ingredients.filter((item) => item.trim() !== "").join(", ");
    if (!query) {
      setError("Please enter at least one ingredient!");
      return;
    }

    playAudio4generate(); // play audio when the button is clicked
    setLoadingGenerate(true); // set loading for generate dish
    setDish(null);
    setError(null);

    try {
      const res = await fetch(
        `/api/generate?items=${encodeURIComponent(query)}&diet=${dietaryPrefer}&nutritional=${showNutriInfo}`
      );
      const data = await res.json();

      if (data.error) {
        setError("Error generating meals..."); // show error msg
      } else {
        const formattedDish = formatDishText(data.choices[0].message.content);
        setDish(formattedDish);
      }
    } catch (err) {
      setError("Something went wrong, please try again!");
    } finally {
      setLoadingGenerate(false); // reset loading for generate dish
    }
  };

  // surprise me func
  const surpriseMe = async () => {
    playAudio4suprise(); // play audio when the button is clicked
    setLoadingSurprise(true); // set loading for surprise me
    setDish(null);
    setError(null);

    try {
      const res = await fetch(`/api/generate?surprise=true`);
      const data = await res.json();

      if (data.error) {
        setError("Error generating surprise meal...");
      } else {
        const formattedDish = formatDishText(data.choices[0].message.content);
        setDish(formattedDish);
      }
    } catch (err) {
      setError("Something went wrong, please try again!");
    } finally {
      setLoadingSurprise(false); // reset loading for surprise fun
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-gray-900 text-white p-6"
      style={{
        backgroundImage: "url('/main-bg.png')",
      }}
    >
      {/* meal master logo */}
      <img
        src="/logo.png"
        alt="Meal Master Logo"
        className="mb-6 w-48 h-auto"
      />

      {/* show error message */}
      {error && (
        <div
          id="alert-2"
          className="flex items-center p-4 mb-4 text-red-500 rounded-lg bg-gray-800 dark:bg-gray-800 dark:text-red-500 absolute bottom-4 right-4 z-10"
          role="alert"
        >
          <div className="ms-3 text-sm font-medium">{error}</div>
          <button
            type="button"
            className="ms-auto -mx-1.5 -my-1.5 bg-gray-800 text-red-500 rounded-lg p-1.5 hover:bg-gray-700"
            onClick={() => setError(null)} // close it after clicking
            aria-label="Close"
          >
            ✖
          </button>
        </div>
      )}

      <div className="flex flex-col items-center w-full max-w-md">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2 w-full">
            <input
              type="text"
              id={`ingredient-box-${index}`}
              value={ingredient}
              onChange={(e) => updateIngredient(index, e.target.value)}
              placeholder={`Enter ingredient ${index + 1}`}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg p-2.5 flex-grow"
            />
            <button
              onClick={() => removeIngredientBox(index)}
              className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2"
            >
              ✖
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addIngredientBox}
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2"
      >
        + Add More Ingredients
      </button>

      {/* nutritional information and dropdown */}
      <div className="flex items-center mb-4">
        <input
          id="default-checkbox"
          type="checkbox"
          checked={showNutriInfo}
          onChange={() => setShowNutriInfo(!showNutriInfo)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
        />
        <label
          htmlFor="default-checkbox"
          className="ms-2 text-sm font-medium text-gray-300"
        >
          Get Nutritional Information
        </label>
      </div>

      <div className="flex items-center justify-center mb-4">
        <select
          value={dietaryPrefer}
          onChange={(e) => setdietaryPrefer(e.target.value)}
          className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg p-2 me-4"
        >
          <option value="vegetarian">Vegetarian 🥦</option>
          <option value="non-vegetarian">Non-Vegetarian 🍖</option>
          <option value="any">Any 🍱</option>
        </select>
      </div>

      {/* ass grabed buttons toget */}
      <div className="flex space-x-4">
        <button
          onClick={generateDishes}
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          {loadingGenerate ? "Loading..." : "Generate Dish 🌯"}
        </button>

        <button
          onClick={surpriseMe}
          className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          {loadingSurprise ? "Loading..." : "Surprise Me ✨"}
        </button>
      </div>

      {dish && (
        <div
          className="mt-8 p-4 bg-gray-800 rounded shadow-md text-gray-300 whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: dish }}
        />
      )}
    </div>
  );
};