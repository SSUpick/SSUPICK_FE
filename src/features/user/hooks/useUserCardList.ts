import { useQuery } from '@tanstack/react-query';

import { getUserCardList } from '../api';

export const useUserCardList = () =>
    useQuery({
        queryKey: ['user', 'cards'],
        queryFn: getUserCardList,
    });
