import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function AdminPageContentLayout({ children }: Props) {
  return (
    <div className="mx-auto max-w-[1100px] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden px-6 py-4">
      {children}
    </div>
  );
}
