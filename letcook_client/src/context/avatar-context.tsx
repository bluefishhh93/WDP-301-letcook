'use client'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useProfileContext } from './profile-context';

type AvatarContextType = {
  avatarUrl: string | null;
  updateAvatar: (url: string) => void;
};

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

export const AvatarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useProfileContext();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar || null);

  const updateAvatar = useCallback((url: string) => {
    setAvatarUrl(url);
  }, []);

  useEffect(() => {
    if (profile?.avatar) {
      setAvatarUrl(profile.avatar);
    }
  }, [profile]);

  return (
    <AvatarContext.Provider value={{ avatarUrl, updateAvatar }}>
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = () => {
  const context = useContext(AvatarContext);
  if (context === undefined) {
    throw new Error('useAvatar must be used within an AvatarProvider');
  }
  return context;
};