import React from "react";
import { PANORAMA_BACKGROUND_IMAGE_URL } from "../constants";

type Props = {};

export default function PanoramaLoading({}: Props) {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-neutral-900 relative">
      <img
        src={PANORAMA_BACKGROUND_IMAGE_URL}
        className="w-full h-full object-cover z-0 absolute inset-0 opacity-20"
      />
      <div className="flex flex-col items-center gap-4 ">
        <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin z-10" />
        <p className="text-white/60 text-sm z-10">Loading location...</p>
      </div>
    </div>
  );
}
