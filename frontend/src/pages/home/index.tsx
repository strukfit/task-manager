import { Link, Navigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';

export default function Page() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/workspaces" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">TaskManager</h1>
          <Link to="/login">
            <Button variant="outline">Log In</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Organize Your Work with TaskManager
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
            Streamline your projects and tasks with our intuitive
            workspace-based task management app. Collaborate, track progress,
            and stay productive.
          </p>
          <div className="mt-10">
            <Link to="/login">
              <Button size="lg" className="text-lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900">
            Why Choose TaskManager?
          </h3>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Workspaces</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Organize your projects into workspaces for better focus and
                  collaboration.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Break down your work into manageable projects with clear goals
                  and deadlines.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track tasks and issues with a drag-and-drop interface for
                  seamless workflow.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            &copy; 2025 TaskManager. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
