import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import { fetchProfile } from "@/services/user.service";

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
}

export default function useProfile(token: string): UseProfileResult {
    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchUserProfile = async () => {
            if (!token) {
                setError(new Error("Token is required"));
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const data = await fetchProfile(token);
                if (isMounted) {
                    setProfile(data);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err : new Error("An error occurred while fetching the profile"));
                    setProfile(null);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchUserProfile();

        return () => {
            isMounted = false;
        };
    }, [token]);

    return { profile, isLoading, error };
}