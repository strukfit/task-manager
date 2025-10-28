import { LucideIcon } from 'lucide-react';
import React from 'react';

export const createIcon = (
  icon: LucideIcon,
  size: number = 4,
  color?: string
) => {
  return React.createElement(icon, {
    className: `h-${size} w-${size} ${color}`,
  });
};
