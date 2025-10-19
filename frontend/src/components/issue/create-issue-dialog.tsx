import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import IssueForm from './issue-form';
import { IssueStatus } from '@/constants/issue';

interface CreateIssueDialogProps {
  trigger?: React.ReactNode;
  initStatus?: IssueStatus;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateIssueDialog({
  trigger,
  initStatus,
  open,
  onOpenChange,
}: CreateIssueDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="p-4">
        <DialogHeader>
          <DialogTitle className="text-base">New Issue</DialogTitle>
        </DialogHeader>
        <IssueForm
          initStatus={initStatus}
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
