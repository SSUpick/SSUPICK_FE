import { useQuery } from '@tanstack/react-query';

import { getProfileViewList } from '../api';

export const useProfileViewList = () =>
    useQuery({
        queryKey: ['user', 'me', 'profile-views'],
        queryFn: getProfileViewList,
    });
