import { useAuth } from '@/contexts/AuthContext';

export function useUserProfile() {
  const { profile, refreshProfile } = useAuth();

  return {
    userID: profile?.userID,
    name: profile?.displayName || '',
    phone: profile?.phone || '',
    activeLevel: profile?.activeLevel || '',
    avatar: profile?.displayName
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName)}&background=random&rounded=true&size=256`
      : '',
    refreshProfile,
  };
}
