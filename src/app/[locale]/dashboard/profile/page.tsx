import { Suspense } from 'react';
import ProfileInfo from '@/components/profile/ProfileInfo';
import ProfileSkeleton from '@/components/profile/ProfileSkeleton';

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileInfo />
    </Suspense>
  );
}
