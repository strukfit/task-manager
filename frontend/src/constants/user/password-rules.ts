import { Check, X } from 'lucide-react';
import { createIcon } from '../common';

export interface PasswordRule {
  key: string;
  text: string;
  isValid: (password: string) => boolean;
  getIcon: (valid: boolean) => React.ReactNode;
}

const getIcon = (valid: boolean) => {
  const icon = valid ? Check : X;
  const color = valid ? 'text-green-500' : 'text-red-500';
  return createIcon(icon, 4, color);
};

export const PASSWORD_RULES: PasswordRule[] = [
  {
    key: 'length',
    text: '8-128 characters',
    isValid: pwd => pwd.length >= 8 && pwd.length <= 128,
    getIcon,
  },
  {
    key: 'uppercase',
    text: 'Contains uppercase letter',
    isValid: pwd => /[A-Z]/.test(pwd),
    getIcon,
  },
  {
    key: 'lowercase',
    text: 'Contains lowercase letter',
    isValid: pwd => /[a-z]/.test(pwd),
    getIcon,
  },
  {
    key: 'digit',
    text: 'Contains digit',
    isValid: pwd => /\d/.test(pwd),
    getIcon,
  },
  {
    key: 'noWhitespace',
    text: 'No whitespace',
    isValid: pwd => !/\s/.test(pwd),
    getIcon,
  },
];
