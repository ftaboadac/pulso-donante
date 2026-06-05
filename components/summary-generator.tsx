"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function SummaryGenerator() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function generateSummary() {
    setIsLoading(true);
    setSummary("");
    setError("");

    try {
      const response = await fetch("/api/ai/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const payload = (await response.json()) as { summary?: string; error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to generate summary.");
      }

      setSummary(payload.summary ?? "");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to generate summary.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card id="ai">
      <CardHeader>
        <CardTitle>AI summary</CardTitle>
        <CardDescription>Starter endpoint for report generation and AI-assisted workflows.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste meeting notes, form responses, a chat transcript, or raw research..."
          rows={6}
        />
        <Button onClick={generateSummary} disabled={isLoading || text.trim().length < 10} className="w-full">
          <Sparkles className="size-4" />
          {isLoading ? "Generating..." : "Generate summary"}
        </Button>
        {error && <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
        {summary && <p className="rounded-md border bg-muted p-3 text-sm leading-6">{summary}</p>}
      </CardContent>
    </Card>
  );
}
