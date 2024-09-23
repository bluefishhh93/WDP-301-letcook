import React from 'react';
import UserProfile from './profile/UserProfile';
import UserWrapper from '@/components/UserWrapper';
import { Toaster } from '@/components/ui/toaster';

const UserPage: React.FC = () => {

    return (
        <UserWrapper>
            <UserProfile />
            <Toaster />
        </UserWrapper>
    )
};

export default UserPage;