import { Compass } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import { usePageTitle } from '../hooks/usePageTitle';
import { containerClass } from '../lib/ui';

export default function NotFound() {
  usePageTitle('Page not found');

  return (
    <div className={`${containerClass} py-16`}>
      <EmptyState
        icon={Compass}
        title="This page does not exist"
        message="The link may be broken or the page may have moved."
        actionLabel="Back to home"
        actionTo="/"
      />
    </div>
  );
}
