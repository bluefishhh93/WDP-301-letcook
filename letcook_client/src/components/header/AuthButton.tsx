// 'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthFormToggle } from '@/hooks/useAuthFormToggle';
import { getInitials } from '@/utils/string.utils';
import { signIn, signOut, useSession } from 'next-auth/react';
import Notification from '../Notification';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { useAvatar } from '@/context/avatar-context';
import { fetchProfile } from '@/services/user.service';
interface LoginFormProps {
  handleGoogleLogin: () => void;
}
interface UserAvatarProps {
  avatar: string;
  username: string;
  handleLogout: () => void;
}
export default function AuthButton() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {avatarUrl} = useAvatar();

  const fetchProfileData = useCallback(async () => {
    if (session?.user?.accessToken && !profile) {
      setIsLoading(true);
      try {
        const data = await fetchProfile(session.user.accessToken);
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [session, profile]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfileData();
    }
  }, [status, fetchProfileData]);

  const handleGoogleLogin = async () => {
    await signIn('google');
  };

  const handleLogout = async () => {
    await signOut();
    setProfile(null);
  };

  if (status === 'loading' || isLoading) {
    return <Button variant="outline" disabled>Loading...</Button>;
  }

  return (
    <>
      {session?.user ? (
        <UserAvatar
          username={session.user.username || 'User'}
          avatar={ avatarUrl || profile?.avatar}
          handleLogout={handleLogout}
        />
      ) : (
        <LoginForm handleGoogleLogin={handleGoogleLogin} />
      )}
    </>
  );
}

export function LoginForm({ handleGoogleLogin }: LoginFormProps) {
  const { isOpen, setIsOpen } = useAuthFormToggle();
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Authenticate</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Authenticate</DialogTitle>
            <DialogDescription>
              Đăng nhập để sử dụng các tính năng của Letcook!!
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col justify-center space-y-4 ">
            <Button
              className="bg-indigo-600"
              // onClick={handleDiscordLogin}
            >
              Đăng nhập với Discord
            </Button>
            <Button className="bg-red-600" onClick={handleGoogleLogin}>
              Đăng nhập với Google
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function UserAvatar({
  username,
  avatar,
  handleLogout,
}: UserAvatarProps) {
  return (
    <div className="flex flex-row space-x-2">
      <Notification />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage src={avatar}></AvatarImage>
            <AvatarFallback>{getInitials(username)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 flex flex-col">  
          <DropdownMenuItem className='w-full'>
            <Link href="/user">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="w-full" onClick={handleLogout}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
