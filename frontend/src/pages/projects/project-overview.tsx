import BoardShell from '@/components/board/board-shell';
import IssuesBoard from '@/components/issue/issues-board';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProjectById } from '@/hooks/use-projects';
import { Link, useParams } from 'react-router';

export default function ProjectOverviewPage() {
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();
  const { project } = useProjectById(Number(workspaceId), Number(projectId));

  return (
    <BoardShell
      header={
        <Breadcrumb className="ml-2">
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbPage>Workspace</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <Link to={`/workspaces/${workspaceId}/projects`}>Projects</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{project?.name || 'Project'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
    >
      <div className="flex flex-1 flex-col overflow-x-hidden">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
          </TabsList>
          <TabsContent value="overview"></TabsContent>
          <TabsContent value="issues">
            <IssuesBoard />
          </TabsContent>
        </Tabs>
      </div>
    </BoardShell>
  );
}
