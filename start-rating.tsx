import React, { useState } from 'react';

// Star component to replace external library import
const Star = ({ 
  className = '', 
  fill = 'none', 
  size = 32 
}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={fill} 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// Plus Icon component
const PlusIcon = ({ 
  className = '', 
  size = 24 
}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const StarRating = ({ 
  maxTotalStars = 10,
  initialTotalStars = 5, 
  initialRating = 0, 
  onRatingChange,
  onTotalStarsChange
}) => {
  const [totalStars, setTotalStars] = useState(initialTotalStars);
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRatingChange = (selectedRating) => {
    setRating(selectedRating);
    if (onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  const handleAddStar = () => {
    if (totalStars < maxTotalStars) {
      const newTotalStars = totalStars + 1;
      setTotalStars(newTotalStars);
      
      // Adjust rating if it exceeds new total stars
      const newRating = Math.min(rating, newTotalStars);
      setRating(newRating);

      if (onTotalStarsChange) {
        onTotalStarsChange(newTotalStars);
      }
    }
  };

  const getStarFillPercentage = (starIndex, currentRating) => {
    // Adjust starIndex to be 0-based for calculation
    const adjustedStarIndex = starIndex - 1;
    
    // Calculate fill percentage
    if (currentRating > adjustedStarIndex + 1) return 100;
    if (currentRating > adjustedStarIndex) {
      return (currentRating - adjustedStarIndex) * 100;
    }
    return 0;
  };

  return (
    <div className="flex items-center">
      <div className="flex">
        {[...Array(totalStars)].map((_, index) => {
          const starValue = index + 1;
          const fillPercentage = getStarFillPercentage(
            starValue, 
            hoverRating > 0 ? hoverRating : rating
          );

          return (
            <div 
              key={index} 
              className="relative cursor-pointer"
              onMouseEnter={() => setHoverRating(starValue - 0.5)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const width = rect.width;
                const isLeftHalf = x < width / 2;
                
                setHoverRating(isLeftHalf 
                  ? starValue - 0.5 
                  : starValue
                );
              }}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleRatingChange(
                hoverRating > 0 ? hoverRating : starValue
              )}
            >
              <Star 
                className="text-gray-300" 
                fill="currentColor"
                size={32}
              />
              <div 
                className="absolute top-0 left-0 overflow-hidden" 
                style={{ 
                  width: `${fillPercentage}%`,
                  height: '100%'
                }}
              >
                <Star 
                  className="text-yellow-400" 
                  fill="currentColor"
                  size={32}
                />
              </div>
            </div>
          );
        })}
        
        {/* Add Star Button */}
        {totalStars < maxTotalStars && (
          <button 
            onClick={handleAddStar}
            className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            title="Add Star"
          >
            <PlusIcon className="text-gray-500 hover:text-gray-700" size={24} />
          </button>
        )}
      </div>
      
      <span className="ml-2 text-gray-600">
        {(hoverRating > 0 ? hoverRating : rating).toFixed(1)}
      </span>
    </div>
  );
};

const App = () => {
  const [rating, setRating] = useState(0);
  const [totalStars, setTotalStars] = useState(5);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    console.log('Selected rating:', newRating);
  };

  const handleTotalStarsChange = (newTotalStars) => {
    setTotalStars(newTotalStars);
    console.log('Total stars:', newTotalStars);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Rate Your Experience</h1>
      <StarRating 
        maxTotalStars={10}
        initialTotalStars={5} 
        initialRating={0}
        onRatingChange={handleRatingChange}
        onTotalStarsChange={handleTotalStarsChange}
      />
      <p className="mt-4 text-gray-600">
        Current Rating: {rating.toFixed(1)} / {totalStars}
      </p>
    </div>
  );
};

export default App;
