import { IssueCreate } from '@/schemas/issue';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import IssueForm from './issue-form';

interface CreateIssueDialogProps {
  trigger?: React.ReactNode;
  initValues?: Partial<IssueCreate>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateIssueDialog({
  trigger,
  initValues,
  open,
  onOpenChange,
}: CreateIssueDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="p-4 w-fit min-w-xl !max-w-full">
        <DialogHeader>
          <DialogTitle className="text-base">New Issue</DialogTitle>
        </DialogHeader>
        <IssueForm
          initValues={initValues}
          onSuccess={() => {
            onOpenChange?.(false);
          }}
          onCancel={() => {
            onOpenChange?.(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
