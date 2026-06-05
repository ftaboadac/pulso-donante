"use client";

import { useActionState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";

import { createTaskAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ActionState } from "@/types/actions";

const initialState: ActionState = { status: "idle", message: "" };

export function TaskForm() {
  const [state, formAction] = useActionState(createTaskAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>New task</CardTitle>
        <CardDescription>Use this as the starter pattern for data collection forms.</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-4">
          <Input name="title" placeholder="Title" required minLength={2} />
          <Textarea name="description" placeholder="Description" rows={4} />
          {state.message && (
            <Alert variant={state.status === "error" ? "destructive" : "default"}>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          <SubmitButton className="w-full">
            <Plus className="size-4" />
            Create task
          </SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
