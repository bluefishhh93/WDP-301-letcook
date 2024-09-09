'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import useAuth from '@/hooks/useAuth';
import { User, UserInfo } from 'CustomTypes';

const UserWrapper = dynamic(() => import('@/components/UserWrapper'), { ssr: false });
const FormPost = dynamic(() => import('../components/PostForm'), { ssr: false });
const ToastContainer = dynamic(() => import('react-toastify').then(mod => mod.ToastContainer), { ssr: false });

import 'react-toastify/dist/ReactToastify.css';

export default function AddPostPage() {
  const [user, setUser] = useState<(User & UserInfo) | null>(null);
  const { user: authUser } = useAuth();

  useEffect(() => {
    if (authUser) {
      // Assuming authUser contains both User and UserInfo properties
      setUser(authUser as unknown as User & UserInfo);
    }
  }, [authUser]);

  if (!user) {
    return null; // or a loading indicator
  }

  return (
    <UserWrapper>
      <div className="mx-10">
        <FormPost user={user} />
        <ToastContainer />
      </div>
    </UserWrapper>
  );
}