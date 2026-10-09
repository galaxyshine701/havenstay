import Skeleton from './Skeleton';
import { cardClass } from '../lib/ui';

// Same shape as <HotelCard />, so the page does not jump when the data arrives.
export default function HotelCardSkeleton() {
  return (
    <div className={`${cardClass} flex flex-col overflow-hidden md:flex-row`} aria-hidden="true">
      <Skeleton className="h-56 rounded-none md:h-auto md:w-72 md:shrink-0" />

      <div className="flex flex-1 flex-col gap-3 p-4 md:p-6">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-haven-900/10 p-4 md:w-60 md:shrink-0 md:items-end md:justify-between md:border-l md:border-t-0 md:p-6">
        <div className="space-y-2 md:flex md:flex-col md:items-end">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-11 w-full md:w-32" />
      </div>
    </div>
  );
}
