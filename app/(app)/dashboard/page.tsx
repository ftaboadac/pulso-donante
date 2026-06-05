import { ClipboardList, Clock3, Sparkles, Target } from "lucide-react";

import { SummaryGenerator } from "@/components/summary-generator";
import { TaskForm } from "@/components/task-form";
import { TaskTable } from "@/components/task-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTasks } from "@/lib/tasks";

export default async function DashboardPage() {
  const { tasks, error, usingDemoData } = await getTasks();
  const total = tasks.length;
  const inProgress = tasks.filter((task) => task.status === "in_progress").length;
  const done = tasks.filter((task) => task.status === "done").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">Hackathon command center</p>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-normal">Dashboard</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Ship CRUD flows, AI helpers, forms, and internal-tool screens from one monolithic Next.js app.
            </p>
          </div>
        </div>
      </div>

      {(usingDemoData || error) && (
        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertTitle>{usingDemoData ? "Demo data is active" : "Database fallback active"}</AlertTitle>
          <AlertDescription>
            {error
              ? `Supabase returned: ${error}. The UI is still usable with local demo tasks.`
              : "Add Supabase environment variables and run the SQL schema when you are ready to persist data."}
          </AlertDescription>
        </Alert>
      )}

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard icon={ClipboardList} label="Total tasks" value={total} />
        <MetricCard icon={Clock3} label="In progress" value={inProgress} />
        <MetricCard icon={Target} label="Done" value={done} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskTable tasks={tasks} />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <TaskForm />
          <SummaryGenerator />
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ClipboardList;
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex size-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
