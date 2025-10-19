import { useCallback, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmationDialogProps {
  trigger?: React.ReactNode;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ConfirmationDialog({
  trigger,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  open: controlledOpen,
  onOpenChange,
}: ConfirmationDialogProps) {
  const isControlled = controlledOpen !== undefined;
  const [open, setOpen] = useState(false);

  const handleConfirm = useCallback(async () => {
    await onConfirm();
    if (isControlled) {
      onOpenChange?.(false);
    } else {
      setOpen(false);
    }
  }, [isControlled, onConfirm, onOpenChange]);

  const handleCancel = useCallback(() => {
    onCancel?.();
    if (isControlled) {
      onOpenChange?.(false);
    } else {
      setOpen(false);
    }
  }, [isControlled, onCancel, onOpenChange]);

  return (
    <Dialog
      open={isControlled ? controlledOpen : open}
      onOpenChange={isControlled ? onOpenChange : setOpen}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {cancelText}
          </Button>
          <Button onClick={handleConfirm}>{confirmText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
