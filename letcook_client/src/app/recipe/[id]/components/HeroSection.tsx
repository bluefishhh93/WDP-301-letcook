import React, { useState, useEffect } from 'react';
import { Recipe } from 'CustomTypes';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import axios from '@/lib/axios';
import { useSession } from 'next-auth/react';

interface HeroSectionProps {
  recipe: Recipe;
}

const HeroSection: React.FC<HeroSectionProps> = ({ recipe }) => {
  const { data: session } = useSession();
  const [userId, setUserId] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);

  useEffect(() => {
    if (session?.user.id) {
      setUserId(session.user.id);
      fetchFollowedUsers(session.user.id);
    }
  }, [session]);

  const fetchFollowedUsers = async (userId: string) => {
    try {
      const response = await axios.get(`/api/users/following/${userId}`);
      const followedUserIds = response.data.map((user: any) => user.id);
      setFollowedUsers(followedUserIds);
      setIsFollowing(followedUserIds.includes(recipe.user.id));
    } catch (error) {
      console.error('Error fetching followed users:', error);
    }
  };

  const handleFollow = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const response = await axios.put(`/api/users/following/${userId}`, {
        followedUserId: recipe.user.id,
      });

      // Cập nhật trạng thái theo dõi sau khi nhận phản hồi từ API
      if (isFollowing) {
        setFollowedUsers((prev) => prev.filter((id) => id !== recipe.user.id));
      } else {
        setFollowedUsers((prev) => [...prev, recipe.user.id]);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  const handleShare = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const currentUrl = window.location.href;

    try {
      await navigator.clipboard.writeText(currentUrl);

      if (navigator.share) {
        await navigator.share({
          title: 'Check out this recipe!',
          text: 'Take a look at this amazing recipe!',
          url: currentUrl,
        });
      } else {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        window.open(facebookUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error sharing recipe:', error);
    }
  };

  return (
    <div className="mb-12">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <img
            src={recipe.images[0]}
            alt={recipe.title}
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="md:w-2/3">
          <h2 className="text-4xl font-mono mb-4">{recipe.title}</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            {recipe.description}
          </p>

          <div className="flex items-center mt-6 p-4 border-t border-gray-200 dark:border-gray-700">
            <Avatar className="w-16 h-16 rounded-full shadow-lg">
              <AvatarImage src={recipe.user.avatar} alt={recipe.user.name} />
              <AvatarFallback>{recipe.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-4 flex flex-col justify-center">
              <p className="font-semibold text-xl text-gray-900 dark:text-gray-100">{recipe.user.name}</p>
              <div className='d-flex mx-2'>
                {recipe.user.id !== userId && (
                  <Button
                    onClick={handleFollow}
                    variant="outline"
                    className={`mt-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full transition duration-300 ease-in-out ${
                      isFollowing ? 'bg-red-500 hover:bg-red-600 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                    }`}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                )}
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="mt-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-blue-200 dark:hover:bg-gray-800 transition duration-300 ease-in-out"
                >
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
