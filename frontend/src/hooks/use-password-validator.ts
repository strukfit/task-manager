import { FieldPath, FieldValues, useWatch } from 'react-hook-form';
import { PASSWORD_RULES } from '@/constants/user';
import { Control } from 'react-hook-form';

export function usePasswordValidation<T extends FieldValues>(
  control: Control<T>,
  fieldName: FieldPath<T> = 'password' as FieldPath<T>
) {
  const password = useWatch({
    control: control as Control<FieldValues>,
    name: fieldName as string,
    defaultValue: '',
  });

  const passwordNotEmpty = password.length > 0;

  const feedback = PASSWORD_RULES.map(rule => ({
    ...rule,
    valid: passwordNotEmpty && rule.isValid(password),
  }));

  return {
    password,
    feedback,
    isValid: feedback.every(f => f.valid),
  };
}
