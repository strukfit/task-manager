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
import { Path, PathValue, UseFormReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface StatusField {
  status: IssueStatus;
}

interface StatusSelectProps<T extends StatusField> {
  form: UseFormReturn<T>;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function StatusSelect<T extends StatusField>({
  form,
  onValueChange,
  className,
}: StatusSelectProps<T>) {
  const path = 'status' as Path<T>;
  const status = form.watch(path);
  return (
    <Select
      value={status}
      onValueChange={value => {
        form.setValue(path, value as PathValue<T, Path<T>>);
        onValueChange?.(value);
      }}
    >
      <SelectTrigger
        size="sm"
        className={cn(
          '[&>svg]:hidden hover:bg-gray-100 hover:ring-1 hover:ring-gray-300 select-none rounded-sm',
          className
        )}
        onClick={e => e.stopPropagation()}
      >
        <SelectValue placeholder="Select Status">
          {status && (
            <div className="flex items-center gap-2">
              {getStatusIcon(status)}
              <span>{ISSUE_STATUS_LABELS[status]}</span>
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
