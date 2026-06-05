import Link from "next/link";

import { signInAction, signUpAction } from "@/app/(auth)/login/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { isSupabaseConfigured } from "@/lib/config";

export default function LoginPage() {
  const configured = isSupabaseConfigured();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Team login</CardTitle>
          <CardDescription>Optional Supabase Auth for demos that need private data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!configured && (
            <Alert>
              <AlertTitle>Supabase is not configured</AlertTitle>
              <AlertDescription>
                <span>
                  Add <code className="break-all">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                  <code className="break-all">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> to enable auth.
                </span>
              </AlertDescription>
            </Alert>
          )}

          <form className="space-y-3">
            <Input name="email" type="email" placeholder="you@example.com" required />
            <Input name="password" type="password" placeholder="Password" required minLength={6} />
            <div className="grid grid-cols-2 gap-2">
              <Button formAction={signInAction} disabled={!configured} type="submit">
                Sign in
              </Button>
              <Button formAction={signUpAction} disabled={!configured} variant="secondary" type="submit">
                Sign up
              </Button>
            </div>
          </form>

          <Button asChild variant="ghost" className="w-full">
            <Link href="/dashboard">Skip for now</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
