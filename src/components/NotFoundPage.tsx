import React from 'react';
import { Home, Search, ShieldAlert } from 'lucide-react';

interface NotFoundPageProps {
  onBackHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onBackHome }) => {
  return (
    <div className="min-h-[70vh] bg-[#FBF9F4]">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F7F5F0] text-[#0348AB] shadow-sm">
          <ShieldAlert className="h-9 w-9" />
        </div>

        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#0348AB]">404 error</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#0a1e36] sm:text-5xl">Page not found</h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-[#607087]">
          The page you’re looking for may have moved, been renamed, or may not exist in this portal yet.
          Use the quick links below to return to the main public service hub.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0348AB] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#023888]"
          >
            <Home className="h-4 w-4" />
            Back to home
          </button>
          <button
            type="button"
            onClick={() => (window.location.href = '/search?q=services')}
            className="inline-flex items-center gap-2 rounded-xl border border-[#D8D3C7] bg-white px-5 py-3 text-sm font-bold text-[#14274E] transition hover:border-[#0348AB] hover:text-[#0348AB]"
          >
            <Search className="h-4 w-4" />
            Search services
          </button>
        </div>
      </div>
    </div>
  );
};
