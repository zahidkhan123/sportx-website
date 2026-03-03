"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
};

export function ContextMenuBlocker({ children }: Props) {
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  return (
    <div onContextMenu={handleContextMenu} className="min-h-screen">
      {children}
    </div>
  );
}

