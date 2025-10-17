'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

type EditorType = 'input' | 'textarea';

interface EditableTextProps<T extends object> {
  fieldName: keyof T;
  onSave: (field: keyof T, value: string) => Promise<void>;
  editor?: EditorType;
  placeholder: string;
  displayContent: (
    value: string | undefined,
    placeholder: string
  ) => React.ReactNode;
  displayContainerClassName?: string;
  editorClassName?: string;
}

export function EditableText<T extends object>({
  fieldName,
  onSave,
  editor = 'input',
  placeholder,
  displayContent,
  displayContainerClassName = '',
  editorClassName = 'w-full bg-transparent border-0 focus:bg-white focus:border-gray-300 p-2 rounded hover:bg-gray-50',
}: EditableTextProps<T>) {
  const {
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [isEditing, setIsEditing] = useState(false);
  const [originalValue, setOriginalValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  const value = getValues(fieldName as string);
  const hasError = errors[fieldName as string];

  const { ref: formRef, ...rest } = register(fieldName as string);
  const setRef = useCallback(
    (element: HTMLTextAreaElement | HTMLInputElement | null) => {
      editorRef.current = element;
      formRef(element);
    },
    [formRef]
  );

  useEffect(() => {
    if (isEditing) {
      setOriginalValue(value || '');
      editorRef.current?.focus();
      editorRef.current?.setSelectionRange?.(
        editorRef.current.value.length,
        editorRef.current.value.length
      );
    }
  }, [isEditing, value]);

  const handleEnterEdit = () => setIsEditing(true);

  const handleSubmit = async () => {
    const newVal = (getValues(fieldName as string) || '').trim();
    const origTrim = originalValue.trim();

    if (newVal === origTrim) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(fieldName, newVal);
      setIsEditing(false);
    } catch (err) {
      setValue(fieldName as string, originalValue);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      e.key === 'Escape' ||
      (e.key === 'Enter' && !e.shiftKey && editor === 'input')
    ) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isEditing) {
    return (
      <div>
        <div
          className={`cursor-text select-text ${displayContainerClassName} ${
            hasError ? 'border-b border-red-500' : ''
          }`}
          onClick={handleEnterEdit}
          tabIndex={0}
          role="button"
        >
          {displayContent(value, placeholder)}
        </div>
        {hasError && (
          <p className="text-red-500 text-sm mt-1">
            {hasError.message as string}
          </p>
        )}
      </div>
    );
  }

  const Editor = editor === 'textarea' ? Textarea : Input;

  return (
    <div>
      <Editor
        ref={setRef}
        {...rest}
        onBlur={handleSubmit}
        onKeyDown={handleKeyDown}
        className={editorClassName}
        placeholder={placeholder}
        disabled={isSaving}
      />
      {isSaving && <Loader2 className="ml-2 h-4 w-4 animate-spin inline" />}
      {hasError && (
        <p className="text-red-500 text-sm mt-1">
          {hasError.message as string}
        </p>
      )}
    </div>
  );
}
