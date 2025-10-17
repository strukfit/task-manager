import {
  getStatusIcon,
  ISSUE_STATUS_LABELS,
  IssueStatus,
} from '@/constants/issue';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { UseFormReturn } from 'react-hook-form';
import { IssueCreate, IssueEdit } from '@/schemas/issue';

interface StatusSelectProps {
  form: UseFormReturn<IssueCreate | IssueEdit>;
}

export function StatusSelect({ form }: StatusSelectProps) {
  return (
    <Select
      value={form.watch('status')}
      onValueChange={value => {
        form.setValue('status', value as IssueStatus);
      }}
    >
      <SelectTrigger
        size="sm"
        className="[&>svg]:hidden hover:bg-gray-100 hover:ring-1 hover:ring-gray-300"
      >
        <SelectValue placeholder="Select Status">
          {form.watch('status') && (
            <div className="flex items-center gap-2">
              {getStatusIcon(form.watch('status'))}
              <span>{ISSUE_STATUS_LABELS[form.watch('status')]}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(ISSUE_STATUS_LABELS).map(([key, value]) => (
          <SelectItem key={key} value={key}>
            <div className="flex items-center gap-2">
              {getStatusIcon(key as IssueStatus)}
              <span>{value}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
