import { useQuery } from '@tanstack/react-query';

import { getUserProfile } from '../api';

export const useUserProfile = () =>
    useQuery({
        queryKey: ['user', 'me'],
        queryFn: getUserProfile,
    });
