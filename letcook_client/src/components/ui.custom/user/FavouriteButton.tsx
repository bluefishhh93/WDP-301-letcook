import React, { useState, useEffect, useCallback } from 'react';
import axios from '@/lib/axios';
import { BookmarkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  recipeId: string;
  userId: string;
  initialStatus?: boolean;
  onToggle?: (isFavorited: boolean) => void;
  className?: string;
  iconClassName?: string;
  loadingIconClassName?: string;
  saveLabel?: string;
  savedLabel?: string;
  showLabel?: boolean;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  recipeId,
  userId,
  initialStatus = false,
  onToggle,
  className = '',
  iconClassName = '',
  loadingIconClassName = '',
  saveLabel = 'Save Recipe',
  savedLabel = 'Saved',
  showLabel = false,
}) => {
  const [isFavorited, setIsFavorited] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(!initialStatus);

  const checkFavoriteStatus = useCallback(async () => {
    if (initialStatus) return;
    
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/favorite/check/${userId}/${recipeId}`);
      setIsFavorited(response.data.isFavorited);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
    setIsLoading(false);
  }, [recipeId, userId, initialStatus]);

  useEffect(() => {
    checkFavoriteStatus();
  }, [checkFavoriteStatus]);

  const toggleFavorite = async () => {
    setIsLoading(true);
    try {
      if (isFavorited) {
        await axios.delete(`/api/favorite/${userId}/${recipeId}`);
      } else {
        await axios.post('/api/favorite', { userId, recipeId });
      }
      const newFavoritedState = !isFavorited;
      setIsFavorited(newFavoritedState);
      onToggle?.(newFavoritedState);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
    setIsLoading(false);
  };

  const currentLabel = isFavorited ? savedLabel : saveLabel;

  return (
    <button 
      onClick={toggleFavorite}
      disabled={isLoading}
      aria-label={currentLabel}
      title={currentLabel}
      className={cn(
        'group p-2 rounded-full transition-all duration-200 ease-in-out',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        'hover:bg-gray-100 active:bg-gray-200',
        isLoading && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <span className="sr-only">{currentLabel}</span>
      {isLoading ? (
        <BookmarkIcon className={cn('animate-pulse', loadingIconClassName || iconClassName)} />
      ) : (
        <BookmarkIcon 
          className={cn(
            'h-6 w-6 transition-colors duration-200',
            isFavorited ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-600',
            iconClassName
          )} 
        />
      )}
      {showLabel && (
        <span className={cn(
          "ml-2 text-sm",
          isFavorited ? 'text-blue-500' : 'text-gray-600'
        )}>
          {currentLabel}
        </span>
      )}
    </button>
  );
};

export default FavoriteButton;