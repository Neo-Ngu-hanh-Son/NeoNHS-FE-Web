import React from 'react';

interface ErrorModalProps {
  error: string | null;
  onRetry: () => void;
  onClose: () => void;
}

export default function ErrorModal({ error, onRetry, onClose }: ErrorModalProps) {
  if (!error) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="p-6 text-center">
          {/* Error Icon */}
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h3 className="mb-2 text-xl font-bold text-gray-900">Connection Issue</h3>
          <p className="text-sm leading-relaxed text-gray-500">
            {error || "We couldn't load the panorama. Please check your internet connection and try again."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 p-4 pt-0">
          <button
            onClick={onRetry}
            className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-md active:scale-[0.98] transition-transform"
          >
            Try Again
          </button>
          <button
            onClick={onClose}
            className="w-full rounded-xl py-3 text-sm font-medium text-gray-400 active:bg-gray-50"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
