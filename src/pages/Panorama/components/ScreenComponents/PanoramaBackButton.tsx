import { Button } from "@/components";
import { ArrowLeftCircle } from "lucide-react";
import React from "react";

type Props = {};

export default function PanoramaBackButton({}: Props) {
  return (
    <button
      className="absolute top-4 left-4 z-30 p-0 cursor-pointer hover:opacity-80 transition-opacity"
      onClick={() => window.history.back()}
    >
      <ArrowLeftCircle size={26} className="text-white" />
    </button>
  );
}
