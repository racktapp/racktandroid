import { Suspense } from 'react';
import ProfileClientView from './ClientView';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function ProfilePageById({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><LoadingSpinner className="h-8 w-8" /></div>}>
      <ProfileClientView id={params.id} />
    </Suspense>
  );
}
