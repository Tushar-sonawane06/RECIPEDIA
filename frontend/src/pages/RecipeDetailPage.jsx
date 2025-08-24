import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaRegHeart, FaPlay } from 'react-icons/fa';
import { IoPlaySkipForwardSharp, IoPlaySkipBackSharp } from 'react-icons/io5';
import { IoMdSettings, IoMdPause } from 'react-icons/io';

import allRecipes from '../data/recipes.json';
import NotFoundPage from './NotFound.jsx';
import '../styles/RecipeDetail.css';
import { v4 as uuidv4 } from 'uuid';

const RecipeDetailPage = () => {
  const { category, recipeId } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechIndex, setSpeechIndex] = useState(0);
  const [spokenChars, setSpokenChars] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const utteranceRef = useRef(null);
  const contentPartsRef = useRef([]);

  useEffect(() => {
    const found = allRecipes.find(r => r.id === recipeId && r.category === category);
    setRecipe(found);
    if (found) {
      const text = `${found.name}. ${found.about}. Ingredients Required, ${found.ingredients.join(', ')}. Preparation Steps, ${found.preparationSteps.join('. ')}`;
      contentPartsRef.current = text.split('.');
      setSpeechIndex(0);
    }
  }, [recipeId, category]);

  useEffect(() => {
    if (isSpeaking && speechIndex < contentPartsRef.current.length) {
      speak(speechIndex);
    }
  }, [speechIndex, isSpeaking]);

  useEffect(() => {
    window.onbeforeunload = () => window.speechSynthesis.cancel();
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
    setComments([...comments, { id: uuidv4(), text: newComment.trim(), user: username }]);
    setNewComment('');
    setError('');
  };

  const speak = (index) => {
    if (index >= contentPartsRef.current.length) return;
    const utterance = new SpeechSynthesisUtterance(contentPartsRef.current[index]);
    utterance.rate = speechRate;
    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        const totalSpoken = contentPartsRef.current.slice(0, index).join(' ').length + e.charIndex;
        setSpokenChars(totalSpoken);
      }
    };
    utterance.onend = () => {
      if (index + 1 < contentPartsRef.current.length) {
        setSpeechIndex(prev => prev + 1);
      } else {
        setIsSpeaking(false);
        setSpeechIndex(0);
        setSpokenChars(0);
      }
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePlay = () => {
    if (!isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);
    }
  };
  const handlePause = () => {
    window.speechSynthesis.pause();
    setIsSpeaking(false);
  };
  const handleCancel = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };
  const handleSkipForward = () => {
    const newIndex = Math.min(speechIndex + 1, contentPartsRef.current.length - 1);
    if (newIndex !== speechIndex) {
      handleCancel();
      setSpeechIndex(newIndex);
      setIsSpeaking(true);
    }
  };
  const handleSkipBack = () => {
    const newIndex = Math.max(speechIndex - 1, 0);
    if (newIndex !== speechIndex) {
      handleCancel();
      setSpeechIndex(newIndex);
      setIsSpeaking(true);
    }
  };
  const handleSpeed = () => {
    const el = document.getElementById('speed');
    el.classList.toggle('hidden');
  };
  const handleSeek = (e) => {
    const newCharIndex = parseInt(e.target.value, 10);
    setSpokenChars(newCharIndex);
    let accumulated = 0;
    for (let i = 0; i < contentPartsRef.current.length; i++) {
      if (accumulated + contentPartsRef.current[i].length >= newCharIndex) {
        setSpeechIndex(i);
        break;
      }
      accumulated += contentPartsRef.current[i].length;
    }
  };
  const handleSeekRelease = () => {
    if (isDragging) {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);
      speak(speechIndex);
      setIsDragging(false);
    }
  };

  if (!recipe) return <NotFoundPage />;

  return(
  <div className="recipe-detail-container max-w-4xl mx-auto px-4 pt-32 pb-16 dark:bg-slate-800 dark:text-white">
    <button
      onClick={() => navigate(`/${recipe.category}`)}
      className="mb-6 px-4 font-bold py-2.5 bg-red-100 text-red-600 hover:text-white hover:bg-red-500 rounded-xl shadow flex items-center gap-2 w-fit transition-all duration-200"
    >
      <FaArrowLeft className="text-inherit" />
      <span className="font-medium text-base">Back to {recipe.category}</span>
    </button>

    <h1 className="text-4xl font-bold text-center my-10 text-[#d35400]">{recipe.name}</h1>

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

    {/* User Interaction: Likes and Comments */}
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
