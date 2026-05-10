import { useQuery } from '@tanstack/react-query';

import { getTargetUserProfile } from '../api';

export const useTargetUserProfile = (targetUserId: number) =>
    useQuery({
        queryKey: ['user', targetUserId],
        queryFn: () => getTargetUserProfile(targetUserId),
        enabled: targetUserId > 0,
    });
