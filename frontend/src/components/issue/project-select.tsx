import { IssueCreate, IssueEdit } from '@/schemas/issue';
import { UseFormReturn } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { getProjectIcon } from '@/constants/issue';
import { Project } from '@/schemas/project';

interface ProjectSelectProps {
  form: UseFormReturn<IssueCreate | IssueEdit>;
  projects: Project[];
}

export function ProjectSelect({ form, projects }: ProjectSelectProps) {
  return (
    <Select
      value={form.watch('projectId')?.toString() || ''}
      onValueChange={value => {
        form.setValue('projectId', value ? Number(value) : undefined);
      }}
    >
      <SelectTrigger
        size="sm"
        className="[&>svg]:hidden hover:bg-gray-100 hover:ring-1 hover:ring-gray-300"
      >
        <SelectValue placeholder="Select Project">
          {form.watch('projectId')?.toString() && (
            <div className="flex items-center gap-2">
              {getProjectIcon(form.watch('projectId')?.toString() || '-1')}
              <span>
                {form.watch('projectId') === -1
                  ? 'None'
                  : projects.find(p => p.id === form.watch('projectId'))
                      ?.name || 'Select Project'}
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
