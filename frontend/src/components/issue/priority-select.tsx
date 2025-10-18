import { Path, PathValue, UseFormReturn } from 'react-hook-form';
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
import { cn } from '@/lib/utils';

interface PriorityField {
  priority: IssuePriority;
}

interface PrioritySelectProps<T extends PriorityField> {
  form: UseFormReturn<T>;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function PrioritySelect<T extends PriorityField>({
  form,
  onValueChange,
  className,
}: PrioritySelectProps<T>) {
  const path = 'priority' as Path<T>;
  const priority = form.watch(path);
  return (
    <Select
      value={priority}
      onValueChange={value => {
        form.setValue(path, value as PathValue<T, Path<T>>);
        onValueChange?.(value);
      }}
    >
      <SelectTrigger
        size="sm"
        className={cn(
          '[&>svg]:hidden hover:bg-gray-100 hover:ring-1 hover:ring-gray-300 select-none',
          className
        )}
      >
        <SelectValue placeholder="Select Priority">
          {priority && (
            <div className="flex items-center gap-2">
              {getPriorityIcon(priority)}
              <span>{ISSUE_PRIORITY_LABELS[priority]}</span>
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
