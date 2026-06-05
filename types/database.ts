import { z } from "zod";

export const taskStatusSchema = z.enum(["todo", "in_progress", "done"]);

export type TaskStatus = z.infer<typeof taskStatusSchema>;

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: Task;
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          status?: TaskStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          status?: TaskStatus;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
