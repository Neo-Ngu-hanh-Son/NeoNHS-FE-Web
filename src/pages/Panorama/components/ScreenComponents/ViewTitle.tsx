import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ViewTitle({ children }: Props) {
  return (
    <div className="absolute top-0 left-0 p-4 bg-gradient-to-b from-black to-black/0 text-white text-center w-full z-[100]">
      {children}
    </div>
  );
}
