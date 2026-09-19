import React, { useState } from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({
  rating = 5,
  maxRating = 5,
  interactive = false,
  onChange,
  size = 'md',
  showScore = false,
  className = ''
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  const activeRating = interactive ? hoverRating || rating : rating;

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= activeRating;

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange && onChange(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none`}
          >
            <Star
              className={`${starSizes[size] || starSizes.md} ${
                isFilled
                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                  : 'fill-slate-800 text-slate-700'
              } transition-all duration-150`}
            />
          </button>
        );
      })}
      {showScore && (
        <span className="ml-1.5 text-xs font-bold text-amber-400">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
