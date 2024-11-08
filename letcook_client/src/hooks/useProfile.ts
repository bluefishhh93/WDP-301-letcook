import { useEffect, useState, useCallback } from "react";
import { fetchProfile } from "@/services/user.service";
import { useSession } from "next-auth/react";

interface ProfileType {
    username: string;
    phone: string;
    address: string;
    bio: string;
    avatar: string;
}

interface UseProfileResult {
    profile: ProfileType | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export default function useProfile(): UseProfileResult {
    const { data: session, status } = useSession();
    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchUserProfile = useCallback(async () => {
        if (status !== 'authenticated' || !session?.user?.accessToken) {
            setError(new Error("User is not authenticated"));
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const data = await fetchProfile(session.user.accessToken);
            setProfile(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("An error occurred while fetching the profile"));
            setProfile(null);
        } finally {
            setIsLoading(false);
        }
    }, [status, session?.user?.accessToken]);

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    const refetch = useCallback(async () => {
        await fetchUserProfile();
    }, [fetchUserProfile]);

    return { profile, isLoading, error, refetch };
}