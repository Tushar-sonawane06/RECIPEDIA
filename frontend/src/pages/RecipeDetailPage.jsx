import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaRegHeart } from 'react-icons/fa';
import allRecipes from '../data/recipes.json';
import NotFoundPage from './NotFound.jsx';
import '../styles/RecipeDetail.css';
import { v4 as uuidv4 } from 'uuid';
import AudioOverview from '../components/AudioOverview.jsx';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

const RecipeDetailPage = () => {
  const { category, recipeId } = useParams();
const [value, setValue] = React.useState(3);
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  // Speech states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechIndex, setSpeechIndex] = useState(0);
  const [spokenChars, setSpokenChars] = useState(0);

  const contentPartsRef = useRef([]);

  // ✅ IMPROVED: Load recipe and prepare content with section titles
  useEffect(() => {
    const found = allRecipes.find(
      (r) => r.id === recipeId && r.category === category
    );
    setRecipe(found);

    if (found) {
      // Build a clean array of logical parts directly for smoother, more reliable audio flow.
      const parts = [
        found.name,
        "About this Recipe",
        found.about,
        "Ingredients",
        ...found.ingredients, // Spread ingredients as individual spoken lines
        "Preparation Steps",
        ...found.preparationSteps, // Spread steps as individual spoken lines
      ];

      // Filter out any empty strings to prevent silent gaps
      contentPartsRef.current = parts.filter(p => p && p.trim().length > 0);

      // Reset speech state for the new content
      setSpeechIndex(0);
      setSpokenChars(0);
      
      // If speech was active on a previous page, cancel it.
      // The user can press play again to start the new content.
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    // Dependency array is now correct, only runs when the recipe changes.
  }, [recipeId, category]);

  // Cancel speech on unload
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const handleLike = () => setLiked(!liked);

  const handleComment = (e) => {
    e.preventDefault();
    const username = localStorage.getItem('username') || 'Guest';
    if (!newComment.trim()) {
      setError('Comment cannot be empty!');
      return;
    }
    setComments([
      ...comments,
      { id: uuidv4(), text: newComment.trim(), user: username },
    ]);
    setNewComment('');
    setError('');
  };

  if (!recipe) return <NotFoundPage />;

  return (
    <div className="recipe-detail-container max-w-4xl mx-auto px-4 pt-32 pb-16 dark:bg-slate-800 dark:text-white">
      {/* Back Button */}
      <button
        onClick={() => navigate(`/${recipe.category}`)}
        className="mb-6 px-4 font-bold py-2.5 bg-red-100 text-red-600 hover:text-white hover:bg-red-500 rounded-xl shadow flex items-center gap-2 w-fit transition-all duration-200"
      >
        <FaArrowLeft className="text-inherit" />
        <span className="font-medium text-base">Back to {recipe.category}</span>
      </button>

      {/* Title */}
      <h1 className="text-4xl font-bold text-center my-10 text-[#d35400]">
        {recipe.name}
      </h1>

      {/* Image */}
      <img
        src={recipe.image}
        onError={(e) => (e.target.src = '/default.jpg')}
        alt={recipe.name}
        className="w-full h-80 object-cover rounded-xl shadow-lg mb-8"
      />

    {/* Voice Section */}
    <div className="container bg-slate-400 text-black dark:text-white dark:bg-gray-500 mx-auto w-1/2 my-10 p-4 rounded-lg flex-col flex justify-center items-center">
      <div className="flex items-center justify-center w-full">
        <p className="text-[10px] sm:text-[15px] md:text-2xl font-bold mr-7">Audio Overview</p>
        <div onClick={handleSpeed} className="text-xl md:text-4xl cursor-pointer hover:scale-105">
          <IoMdSettings />
        </div>
      </div>
      <div className="flex justify-center sm:justify-around">
        <button onClick={handleSkipBack} className="text-2xl sm:text-4xl hover:scale-105">
          <IoPlaySkipBackSharp />
        </button>
        <button
          onClick={isSpeaking ? handlePause : handlePlay}
          className="text-2xl sm:text-4xl hover:scale-105"
        >
          {isSpeaking ? <IoMdPause /> : <FaPlay />}
        </button>
        <button onClick={handleSkipForward} className="text-2xl sm:text-4xl hover:scale-105">
          <IoPlaySkipForwardSharp />
        </button>
      </div>
      <input
        type="range"
        min={0}
        step={1}
        max={contentPartsRef.current.reduce((a, b) => a + b.length, 0)}
        value={spokenChars}
        onChange={(e) => {
          setIsDragging(true);
          handleSeek(e);
        }}
        onMouseUp={handleSeekRelease}
        onTouchEnd={handleSeekRelease}
        className="w-full"
      />
      <div id="speed" className="hidden flex flex-col sm:flex-row w-full md:gap-2">
        <label htmlFor="rate" className="text-xl sm:text-2xl font-medium ml-1">
          Speed:
        </label>
        <input
          id="rate"
          type="range"
          min="0.25"
          max="3"
          step="0.1"
          value={speechRate}
          onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
          className="accent-pink-600 w-full"
        />
        <span className="text-xl">{speechRate}x</span>
      </div>
    </div>

    <section className="prose max-w-none dark:prose-invert">
      <h2 className="text-2xl font-semibold text-[#d35400] pb-2">About this Recipe</h2>
      <p className='text-gray-700 dark:text-white'>{recipe.about}</p>
      <h2 className="text-2xl font-semibold mt-6 text-[#d35400] pb-2">Ingredients</h2> 
      <ul className="list-disc pl-6 marker:text-red-500 text-gray-700 dark:text-white">
        {recipe.ingredients.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <h2 className="text-2xl font-semibold mt-6 text-[#d35400] pb-2">Preparation Steps</h2>
      <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-white">
        {recipe.preparationSteps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
    </section>

      {/* Likes Section */}
      <div className="mt-10 flex items-center gap-4">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-100 text-red-600 hover:text-white hover:bg-red-500 rounded-xl shadow w-fit transition-all duration-200 focus:outline-none"
        >
          {liked ? <FaHeart className="text-inherit" /> : <FaRegHeart className="text-inherit" />}
          {liked ? 'Liked' : 'Like'}
        </button>
      </div>

    <div className="mt-12">
      <h3 className="text-2xl font-semibold mb-4 text-[#d35400]">Comments</h3>
      <form onSubmit={handleComment}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full border rounded-lg p-4 min-h-[120px] text-black bg-white dark:bg-slate-700 dark:text-white"
        />
        {error && <p className="text-red-600 mt-2 font-semibold">{error}</p>}
        <button
          type="submit"
          className="mt-3 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-semibold"
        >
          Post Comment
        </button>
      </form>
      <div className="space-y-4 mt-6">
        {comments.length > 0 ? (
          comments.map((c) => (
                    <div key={c.id} className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg shadow">
          <strong className="text-gray-800 dark:text-white">{c.user}</strong>
          <p className="text-gray-700 dark:text-gray-300">{c.text}</p>
        </div>
          ))
        ) : (
          <div className="bg-gray-100 dark:bg-slate-700 p-4 rounded-lg shadow text-center text-gray-600 dark:text-gray-300">
            No comments yet. Be the first to share your thoughts!
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default RecipeDetailPage;