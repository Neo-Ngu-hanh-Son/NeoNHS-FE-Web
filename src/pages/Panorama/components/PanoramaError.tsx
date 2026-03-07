import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  error?: string;
};

export default function PanoramaError({ error }: Props) {
  const navigate = useNavigate();
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-neutral-900">
      <div className="flex flex-col items-center gap-4 max-w-sm text-center px-6">
        <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center text-2xl">
          ⚠️
        </div>
        <h2 className="text-white text-lg font-semibold">{error ?? "Place not found"}</h2>
        <p className="text-white/50 text-sm">
          The panorama could not be loaded. Please check the URL and try again.
        </p>
        <p className="text-red-500 text-lg font-mono">Error: {error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-2 px-5 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
        >
          Go back
        </button>
      </div>
    </div>
  );
}
