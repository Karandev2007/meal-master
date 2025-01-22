"use client";

import { useState } from "react";

export default function Home() {
  const [ingredients, setIngredients] = useState([""]);
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // show error msg

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

  // Generate dish and process
  const generateDishes = async () => {
    const query = ingredients.filter((item) => item.trim() !== "").join(", ");
    if (!query) {
      setError("Please enter at least one ingredient!");
      return;
    }

    setLoading(true);
    setDish(null); // clear previous dish
    setError(null);

    try {
      // call api on groq
      const res = await fetch(`/api/generate?items=${encodeURIComponent(query)}`);
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
      setLoading(false); // reset loading
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
          <svg
            className="flex-shrink-0 w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Error</span>
          <div className="ms-3 text-sm font-medium">{error}</div>
          <button
            type="button"
            className="ms-auto -mx-1.5 -my-1.5 bg-gray-800 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-gray-700 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-500 dark:hover:bg-gray-700"
            onClick={() => setError(null)} // close it after clicking
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="w-full max-w-md">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              id={`ingredient-box-${index}`}
              value={ingredient}
              onChange={(e) => updateIngredient(index, e.target.value)}
              placeholder={`Enter ingredient ${index + 1}`}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <button
              onClick={() => removeIngredientBox(index)}
              className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
              ✖
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addIngredientBox}
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        + Add More Ingredients
      </button>

      <button
        onClick={generateDishes}
        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
      >
        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
          {loading ? "Loading..." : "Generate Dish"}
        </span>
      </button>

      {dish && (
        <div
          className="mt-8 p-4 bg-gray-800 rounded shadow-md text-gray-300 whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: dish }}
        />
      )}
    </div>
  );
}