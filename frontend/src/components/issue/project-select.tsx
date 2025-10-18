import { Path, PathValue, UseFormReturn } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { getProjectIcon } from '@/constants/issue';
import { Project } from '@/schemas/project';
import { cn } from '@/lib/utils';

interface ProjectIdField {
  projectId?: number;
}

interface ProjectSelectProps<T extends ProjectIdField> {
  form: UseFormReturn<T>;
  projects: Project[];
  onValueChange?: (value: string) => void;
  className?: string;
}

export function ProjectSelect<T extends ProjectIdField>({
  form,
  projects,
  onValueChange,
  className,
}: ProjectSelectProps<T>) {
  const path = 'projectId' as Path<T>;
  const projectId = form.watch(path);
  return (
    <Select
      value={projectId?.toString() || ''}
      onValueChange={value => {
        form.setValue(
          path,
          (value ? Number(value) : undefined) as PathValue<T, Path<T>>
        );
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
        <SelectValue placeholder="Select Project">
          {projectId?.toString() && (
            <div className="flex items-center gap-2">
              {getProjectIcon(projectId?.toString() || '-1')}
              <span>
                {projectId === -1
                  ? 'None'
                  : projects.find(p => p.id === projectId)?.name ||
                    'Select Project'}
              </span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem key={-1} value={'-1'}>
          <div className="flex items-center gap-2">
            {getProjectIcon('-1')}
            <span>None</span>
          </div>
        </SelectItem>
        {projects.map(project => (
          <SelectItem key={project.id} value={project.id.toString()}>
            <div className="flex items-center gap-2">
              {getProjectIcon(project.id.toString())}
              <span>{project.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
