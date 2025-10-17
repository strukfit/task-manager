import { UseFormReturn } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ISSUE_PRIORITY_LABELS,
  IssuePriority,
  getPriorityIcon,
} from '@/constants/issue';
import { IssueCreate, IssueEdit } from '@/schemas/issue';

interface PrioritySelectProps {
  form: UseFormReturn<IssueCreate | IssueEdit>;
}

export function PrioritySelect({ form }: PrioritySelectProps) {
  return (
    <Select
      value={form.watch('priority')}
      onValueChange={value => {
        form.setValue('priority', value as IssuePriority);
      }}
    >
      <SelectTrigger
        size="sm"
        className="[&>svg]:hidden hover:bg-gray-100 hover:ring-1 hover:ring-gray-300"
      >
        <SelectValue placeholder="Select Priority">
          {form.watch('priority') && (
            <div className="flex items-center gap-2">
              {getPriorityIcon(form.watch('priority'))}
              <span>{ISSUE_PRIORITY_LABELS[form.watch('priority')]}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(ISSUE_PRIORITY_LABELS).map(([key, value]) => (
          <SelectItem key={key} value={key}>
            <div className="flex items-center gap-2">
              {getPriorityIcon(key as IssuePriority)}
              <span>{value}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
