'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import useProfile from '@/hooks/useProfile';
import { useSession } from 'next-auth/react';
import { updateUserProfile } from '@/services/user.service';
type Profile = {
    username?: string;
    phone?: string | null;
    address?: string | null;
    bio?: string | null;
    avatar?: string;
}

type ProfileContextType = {
    profile : Profile | null;
    isLoading: boolean;
    error: Error | null;
    updateProfileData: (userId: string, newData: Profile) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: session } = useSession();
    const { profile: initialProfile, isLoading: initialLoading, error: initialError } = useProfile(session?.user?.id!);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
  
    useEffect(() => {
        if (!initialLoading) {
          setProfile(initialProfile);
          setIsLoading(false);
          setError(initialError);
        }
      }, [initialProfile, initialLoading, initialError]);
    
      const updateProfileData = async (userId: string, newData: Partial<Profile>) => {
        setIsLoading(true);
        setError(null);
        try {
          const updatedProfile = await updateUserProfile(userId, newData);
          setProfile(prevProfile => ({ ...prevProfile, ...updatedProfile }));
        } catch (err) {
          setError(err instanceof Error ? err : new Error('An error occurred while updating the profile'));
        } finally {
          setIsLoading(false);
        }
      };
    return (
        <ProfileContext.Provider value={{ profile, isLoading, error, updateProfileData }}>
          {children}
        </ProfileContext.Provider>
    );
};

export const useProfileContext = () => {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfileContext must be used within a ProfileProvider');
    }
    return context;
}