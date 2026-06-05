import { Trash2 } from "lucide-react";

import { deleteTaskAction, updateTaskStatusAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Task, TaskStatus } from "@/types/database";

const statusLabels: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

const statusClassName: Record<TaskStatus, string> = {
  todo: "bg-secondary text-secondary-foreground",
  in_progress: "bg-accent text-accent-foreground",
  done: "bg-emerald-100 text-emerald-800",
};

export function TaskTable({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return (
      <div id="tasks" className="flex min-h-52 flex-col items-center justify-center rounded-md border border-dashed text-center">
        <h3 className="text-lg font-medium">No tasks yet</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">Create the first task to verify the CRUD path.</p>
      </div>
    );
  }

  return (
    <div id="tasks">
      <div className="space-y-3 md:hidden">
        {tasks.map((task) => (
          <div key={task.id} className="space-y-3 rounded-md border p-4">
            <div>
              <div className="font-medium">{task.title}</div>
              {task.description && <div className="mt-1 text-sm text-muted-foreground">{task.description}</div>}
            </div>
            <Badge className={statusClassName[task.status]}>{statusLabels[task.status]}</Badge>
            <div className="flex items-center gap-2">
              <form action={updateTaskStatusAction} className="flex min-w-0 flex-1 items-center gap-2">
                <input type="hidden" name="id" value={task.id} />
                <TaskStatusSelect task={task} className="min-w-0 flex-1" />
                <Button type="submit" variant="secondary" size="sm">
                  Save
                </Button>
              </form>
              <DeleteTaskButton task={task} />
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden 2xl:table-cell">Created</TableHead>
              <TableHead className="w-16 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="max-w-72">
                  <div className="font-medium">{task.title}</div>
                  {task.description && <div className="mt-1 text-sm text-muted-foreground">{task.description}</div>}
                </TableCell>
                <TableCell>
                  <form action={updateTaskStatusAction} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={task.id} />
                    <TaskStatusSelect task={task} />
                    <Button type="submit" variant="secondary" size="sm">
                      Save
                    </Button>
                  </form>
                </TableCell>
                <TableCell className="hidden whitespace-nowrap text-sm text-muted-foreground 2xl:table-cell">
                  {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(task.created_at))}
                </TableCell>
                <TableCell className="text-right">
                  <DeleteTaskButton task={task} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function TaskStatusSelect({ task, className }: { task: Task; className?: string }) {
  return (
    <select
      name="status"
      defaultValue={task.status}
      className={cn(
        "h-9 rounded-md border border-input bg-background px-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className,
      )}
      aria-label={`Update ${task.title} status`}
    >
      {Object.entries(statusLabels).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}

function DeleteTaskButton({ task }: { task: Task }) {
  return (
    <form action={deleteTaskAction}>
      <input type="hidden" name="id" value={task.id} />
      <Button type="submit" variant="ghost" size="icon" aria-label={`Delete ${task.title}`}>
        <Trash2 className="size-4" />
      </Button>
    </form>
  );
}
